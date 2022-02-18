import { HDKey } from "micro-bip32";
import { mnemonicToSeedSync } from 'micro-bip39';
import { Account, Address, Logger, UnspentTransactionOutput, Wallet } from "../app/interfaces";
import { MINUTE } from "../app/shared/constants";
import { AppManager } from "./application-manager";
import { Psbt } from '@blockcore/blockcore-js';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
const ECPair = ECPairFactory(ecc);
var bitcoinMessage = require('bitcoinjs-message');

/** Manager that keeps state and operations for a single wallet. This object does not keep the password, which must be supplied for signing operations. */
export class WalletManager {
    private timer: any;
    private logger: Logger

    constructor(
        private manager: AppManager) {
        this.logger = manager.logger;
    }

    async signData(wallet: Wallet, account: Account, address: string, content: string): Promise<string> {
        // TODO: Verify the address for this network!! ... Help the user avoid sending transactions on very wrong addresses.
        const network = this.manager.getNetwork(account.networkType);

        // Get the address from receive or change.
        let addressItem = account.state.receive.find(a => a.address == address);
        let addressType = 0;

        if (!addressItem) {
            addressItem = account.state.change.find(a => a.address == address);
            addressType = 1;
        }

        // Get the secret seed.
        const secret = this.walletSecrets.get(wallet.id);

        // Create the master node.
        const masterNode = HDKey.fromMasterSeed(Buffer.from(secret.seed), network.bip32);

        let addressNode: HDKey;
        addressNode = masterNode.derive(`m/${account.purpose}'/${account.network}'/${account.index}'/${addressType}/${addressItem.index}`);

        try {
            const ecPair = ECPair.fromPrivateKey(Buffer.from(addressNode.privateKey), { network: network });
            const privateKey = ecPair.privateKey;

            var signature = bitcoinMessage.sign(content, privateKey, ecPair.compressed)
            console.log(signature.toString('base64'));
            return signature.toString('base64');
        }
        catch (error) {
            this.logger.error(error);
            throw Error('Unable to sign the transaction. Unable to continue.');
        }
    }

    async createTransaction(wallet: Wallet, account: Account, address: string, amount: number, fee: number): Promise<{ addresses: string[], transactionHex: string, fee: number, feeRate: number, virtualSize: number, weight: number }> {
        // TODO: Verify the address for this network!! ... Help the user avoid sending transactions on very wrong addresses.
        const network = this.manager.getNetwork(account.networkType);
        const affectedAddresses = [];

        // We currently only support BTC-compatible transactions such as STRAX. We do not support other Blockcore chains that are not PoS v4.
        const tx = new Psbt({ network: network, maximumFeeRate: 5000 });  // satoshi per byte, 5000 is default.
        tx.setVersion(1); // Lock-time is not used so set to 1 (defaults to 2).
        tx.setLocktime(0); // These are defaults. This line is not needed.

        const unspentReceive = account.state.receive.flatMap(i => i.unspent).filter(i => i !== undefined);
        const unspentChange = account.state.change.flatMap(i => i.unspent).filter(i => i !== undefined);
        const unspent = [...unspentReceive, ...unspentChange];

        // Collect unspent until we have enough amount.
        const requiredAmount = BigInt(amount) + BigInt(fee);
        let aggregatedAmount: number = 0;
        const inputs: UnspentTransactionOutput[] = [];

        for (let i = 0; i < unspent.length; i++) {
            const tx = unspent[i];
            aggregatedAmount += <number>tx.value;

            inputs.push(tx);

            if (aggregatedAmount >= requiredAmount) {
                break;
            }
        }

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const hex = await this.manager.indexer.getTransactionHex(account, input.outpoint.transactionId);

            affectedAddresses.push(input.address);

            tx.addInput({
                hash: input.outpoint.transactionId,
                index: input.outpoint.outputIndex,
                nonWitnessUtxo: Buffer.from(hex, 'hex')
            });
        }

        // Add the output the user requested.
        tx.addOutput({ address, value: amount });

        // Take the total sum of the aggregated inputs, remove the sendAmount and fee.
        const changeAmount = aggregatedAmount - amount - fee;

        // If there is any change amount left, make sure we send it to the user's change address.
        if (changeAmount > 0) {
            const changeAddress = await this.getChangeAddress(account);

            // // Send the rest to change address.
            tx.addOutput({ address: changeAddress.address, value: changeAmount });
        }

        // Get the secret seed.
        const secret = this.walletSecrets.get(wallet.id);

        // Create the master node.
        const masterNode = HDKey.fromMasterSeed(Buffer.from(secret.seed), network.bip32);

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];

            // Get the index of the address, we need that to get the private key for signing.
            let signingAddress = account.state.receive.find(item => item.address == input.address);

            let addressNode: HDKey;

            if (!signingAddress) {
                signingAddress = account.state.change.find(item => item.address == input.address);
                addressNode = masterNode.derive(`m/${account.purpose}'/${account.network}'/${account.index}'/1/${signingAddress.index}`);
            } else {
                addressNode = masterNode.derive(`m/${account.purpose}'/${account.network}'/${account.index}'/0/${signingAddress.index}`);
            }

            if (!signingAddress) {
                throw Error('Unable to find the signing address for the selected transaction input. Unable to continue.');
            }

            try {
                const ecPair = ECPair.fromPrivateKey(Buffer.from(addressNode.privateKey), { network: network });
                tx.signInput(i, ecPair);
            }
            catch (error) {
                this.logger.error(error);
                throw Error('Unable to sign the transaction. Unable to continue.');
            }
        }

        const finalTransaction = tx.finalizeAllInputs().extractTransaction();
        const transactionHex = finalTransaction.toHex();

        this.logger.debug('TransactionHex', transactionHex);

        return { addresses: affectedAddresses, transactionHex, fee: tx.getFee(), feeRate: tx.getFeeRate(), virtualSize: finalTransaction.virtualSize(), weight: finalTransaction.weight() };
    }

    async sendTransaction(account: Account, transactionHex: string): Promise<{ transactionId: string, transactionHex: string }> {
        this.logger.debug('TransactionHex', transactionHex);
        const transactionId = await this.manager.indexer.broadcastTransaction(account, transactionHex);
        this.logger.debug('TransactionId', transactionId);
        return { transactionId, transactionHex };
    }

    getWallets() {
        return this.manager.state.persisted.wallets;
    }

    lockWallets() {
        this.walletSecrets.clear();

        // Do we need to save the state and refresh? VERIFY!
        // await this.state.save();
        // this.refreshState();

        this.manager.communication.sendToAll('wallet-locked');
    }

    lockWallet(id: string) {
        this.walletSecrets.delete(id);

        this.manager.broadcastState();
    }

    calculateBalance(account: Account) {
        let balanceReceive = account.state.receive.map(x => x.balance).reduce((x: any, y: any) => x + y);
        let balanceChange = account.state.change.map(x => x.balance).reduce((x: any, y: any) => x + y);

        return (<any>balanceReceive + <any>balanceChange);
    }

    calculatePendingReceived(account: Account) {
        let balanceReceive = account.state.receive.map(x => x.pendingReceived).reduce((x: any, y: any) => x + y);
        let balanceChange = account.state.change.map(x => x.pendingReceived).reduce((x: any, y: any) => x + y);

        return (<any>balanceReceive + <any>balanceChange);
    }

    calculatePendingSent(account: Account) {
        let balanceReceive = account.state.receive.map(x => x.pendingSent).reduce((x: any, y: any) => x + y);
        let balanceChange = account.state.change.map(x => x.pendingSent).reduce((x: any, y: any) => x + y);

        return (<any>balanceReceive + <any>balanceChange);
    }

    async revealSecretRecoveryPhrase(walletId: string, password: string) {
        var wallet = this.manager.walletManager.getWallet(walletId);
        let unlockedMnemonic = null;

        if (!wallet) {
            return unlockedMnemonic;
        }

        try {
            unlockedMnemonic = await this.manager.crypto.decryptData(wallet.mnemonic, password);
        }
        catch (error) {
            this.logger.error(error);
        }

        return unlockedMnemonic;
    }

    /** Contains the password and seed (unlocked) of wallets. This object should never be persisted and only exists in memory. */
    walletSecrets = new Map<string, { password: string, seed: Uint8Array }>();

    /** Returns list of wallet IDs that is currently unlocked. */
    get unlocked(): string[] {
        return Array.from(this.walletSecrets.keys());
    };

    async unlockWallet(walletId: string, password: string) {
        var wallet = this.manager.walletManager.getWallet(walletId);
        let unlockedMnemonic = null;

        if (!wallet) {
            return unlockedMnemonic;
        }

        unlockedMnemonic = await this.manager.crypto.decryptData(wallet.mnemonic, password);

        if (unlockedMnemonic) {
            this.manager.state.persisted.activeWalletId = wallet.id;

            // From the secret receovery phrase, the master seed is derived.
            // Learn more about the HD keys: https://raw.githubusercontent.com/bitcoin/bips/master/bip-0032/derivation.png
            const masterSeed = mnemonicToSeedSync(unlockedMnemonic);

            // Add this wallet to list of unlocked.
            this.walletSecrets.set(walletId, { password, seed: masterSeed });

            // Make sure we inform all instances when a wallet is unlocked.
            return true;

        } else {
            return false;
        }
    }

    /** Cange the wallet password in one operation. */
    async changeWalletPassword(walletId: string, oldpassword: string, newpassword: string) {
        var wallet = this.manager.walletManager.getWallet(walletId);
        let unlockedMnemonic = null;

        if (!wallet) {
            return unlockedMnemonic;
        }

        unlockedMnemonic = await this.manager.crypto.decryptData(wallet.mnemonic, oldpassword);

        if (unlockedMnemonic) {

            // Encrypt the recovery phrase with new password and persist.
            let encryptedRecoveryPhrase = await this.manager.crypto.encryptData(unlockedMnemonic, newpassword);
            wallet.mnemonic = encryptedRecoveryPhrase;

            // Make sure we persist the newly encrypted recovery phrase.
            await this.manager.state.save();

            // Make sure we delete the existing wallet secret for this wallet.
            this.walletSecrets.delete(walletId);

            const masterSeed = mnemonicToSeedSync(unlockedMnemonic);

            // Add this wallet to list of unlocked.
            this.walletSecrets.set(walletId, { password: newpassword, seed: masterSeed });

            this.manager.state.persisted.activeWalletId = wallet.id;

            return true;

        } else {
            return false;
        }
    }

    resetTimer() {
        this.logger.info('resetTimer:', this.manager.state.persisted.settings.autoTimeout * MINUTE);

        if (this.timer) {
            clearTimeout(this.timer);
        }

        // We will only set timer if the wallet is actually unlocked.
        if (this.walletSecrets.size > 0) {
            this.logger.info('Setting timer to automatically unlock.');
            this.timer = setTimeout(
                () => {
                    this.lockWallets();
                },
                this.manager.state.persisted.settings.autoTimeout * MINUTE
            );
        } else {
            this.logger.info('Timer not set since wallet is not unlocked.');
        }
    }

    get hasWallets(): boolean {
        return this.manager.state.persisted.wallets.length > 0;
    }

    get activeWallet() {
        if (this.manager.state.persisted.activeWalletId) {
            return this.manager.state.persisted.wallets.find(w => w.id == this.manager.state.persisted.activeWalletId);
            // return this.persisted.wallets.get(this.persisted.activeWalletId);
            // return this.persisted.wallets[this.persisted.activeWalletIndex];
        } else {
            return undefined;
        }
    }

    hasAccounts(wallet: Wallet): boolean {
        return wallet.accounts?.length > 0;
    }

    // get activeAccount() {
    //     if (!this.activeWallet) {
    //         return null;
    //     }

    //     const activeWallet = this.activeWallet;

    //     if (!activeWallet.accounts) {
    //         return null;
    //     }

    //     if (activeWallet.activeAccountIndex == null || activeWallet.activeAccountIndex == -1) {
    //         activeWallet.activeAccountIndex = 0;
    //     }
    //     // If the active index is higher than available accounts, reset to zero.
    //     else if (activeWallet.activeAccountIndex >= activeWallet.accounts.length) {
    //         activeWallet.activeAccountIndex = 0;
    //     }

    //     return this.activeWallet.accounts[activeWallet.activeAccountIndex];
    // }

    isActiveWalletUnlocked(): boolean {
        let secret = this.walletSecrets.get(this.activeWallet.id);

        if (secret === null || secret.password === null || secret.password === undefined || secret.password === '') {
            return false;
        } else {
            return true;
        }
    }

    async setActiveWallet(id: string) {
        if (this.manager.state.persisted.activeWalletId != id) {
            this.manager.state.persisted.activeWalletId = id;
            return true;
        }

        return false;
    }

    async setActiveAccount(id: string) {
        if (this.activeWallet.activeAccountId != id) {
            this.activeWallet.activeAccountId = id;
            return true;
        }

        return false;
    }

    getAccount(wallet: Wallet, accountId: string) {
        return wallet.accounts.find(a => a.identifier == accountId);
    }

    getWallet(id: string) {
        const wallet = this.manager.state.persisted.wallets.find(w => w.id == id);
        return wallet;
    }

    async removeWallet(id: string) {
        const walletIndex = this.manager.state.persisted.wallets.findIndex(w => w.id == id);

        // Remove the wallet.
        this.manager.state.persisted.wallets.splice(walletIndex, 1);

        // Remove the password for this wallet, if it was unlocked.
        this.manager.walletManager.walletSecrets.delete(id);

        await this.manager.state.save();

        this.manager.broadcastState();
    }

    async addAccount(account: Account, wallet: Wallet) {
        // First derive the xpub and store that on the account.
        const secret = this.walletSecrets.get(wallet.id);

        const network = this.manager.getNetwork(account.networkType);

        const masterNode = HDKey.fromMasterSeed(Buffer.from(secret.seed), network.bip32);

        const accountNode = masterNode.derive(`m/${account.purpose}'/${account.network}'/${account.index}'`);

        account.xpub = accountNode.publicExtendedKey;

        // Add account to the wallet and persist.
        wallet.accounts.push(account);

        // Update the active account index to new account.
        wallet.activeAccountId = account.identifier;

        // After new account has been added and set as active, we'll generate some addresses:

        // Generate the first receive address.
        await this.getReceiveAddress(account);

        // Generate the first change address.
        await this.getChangeAddress(account);

        // const address = this.crypto.getAddressByNetworkp2pkh(identifierKeyPair, network);
        // const address2 = this.crypto.getAddressByNetworkp2pkhFromBuffer(Buffer.from(Array.from(identifierKeyPair2.publicKey!)), network);

        // const idArray = secp256k1.schnorr.getPublicKey(identifierKeyPair.privateKey!.toString('hex'));
        // const id = Buffer.from(idArray).toString('hex');

        // // Uncaught (in promise) TypeError: The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type object
        // const id2Array = secp256k1.schnorr.getPublicKey(Buffer.from(identifierKeyPair2.privateKey!).toString('hex'));
        // const id2 = Buffer.from(id2Array).toString('hex');

        // const id3hex = Buffer.from(identifierKeyPair3.privateKey!).toString('hex');
        // const id3Array = secp256k1.schnorr.getPublicKey(id3hex);
        // const id3 = Buffer.from(id3Array).toString('hex');

        await this.manager.state.save();

        if (wallet.restored) {
            // Schedule background processing of the account against the blockchain APIs.
            // This should only register a flag and return from this method to allow UI to continue processing.

            // TODO: Perform blockchain / vault data query and recovery.
            // If there are transactions, DID Documents, NFTs or anythign else, we should launch the
            // query probe here.
            this.manager.indexer.process(account, wallet, false);
        }
    }

    async getChangeAddress(account: Account) {
        return this.getAddress(account, 1, account.state.change);
    }

    async getReceiveAddress(account: Account) {
        return this.getAddress(account, 0, account.state.receive);
    }

    hasBeenUsed(address: Address) {
        return (address.totalReceivedCount > 0n || address.totalSent > 0n || address.totalStakeCount > 0n || address.totalMineCount > 0n);
    }

    async getAddress(account: Account, type: number, addresses: Address[]) {
        const index = addresses.length - 1;

        // Get the last index without know transactions:
        let address = addresses[index];

        if (address == null || this.hasBeenUsed(address)) {
            // Generate a new address.
            const addressIndex = index + 1;

            const network = this.manager.getNetwork(account.networkType);
            const accountNode = HDKey.fromExtendedKey(account.xpub, network.bip32);
            const addressNode = accountNode.deriveChild(type).deriveChild(addressIndex);
            const address = this.manager.crypto.getAddressByNetwork(Buffer.from(addressNode.publicKey), network, account.purposeAddress);

            addresses.push({
                index: addressIndex,
                address: address
            });

            await this.manager.state.save();
        }

        return address;
    }

    getReceiveAddressByIndex(account: Account, index: number) {
        if (index > (account.state?.receive.length - 1)) {
            throw Error('The index is higher than any known address. Use getReceiveAddress to get next receive address.');
        }

        // Get the last index without know transactions:
        return account.state.receive[index];
    }

    getChangeAddressByIndex(account: Account, index: number) {
        if (index > (account.state?.change.length - 1)) {
            throw Error('The index is higher than any known address. Use getChangeAddress to get next change address.');
        }

        // Get the last index without know transactions:
        return account.state.change[index];
    }

    async addWallet(wallet: Wallet) {
        this.manager.state.persisted.wallets.push(wallet);

        // Persist the newly created wallet.
        await this.manager.state.save();
    }
}
