import { HDKey } from "micro-bip32";
import { mnemonicToSeedSync } from 'micro-bip39';
import { Account, AccountUnspentTransactionOutput, Address, Logger, Wallet } from "../../shared/interfaces";
import { MINUTE } from "../shared/constants";
import { Psbt } from '@blockcore/blockcore-js';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { Injectable } from "@angular/core";
import { LoggerService } from "./logger.service";
import { CryptoUtility } from "./crypto-utility";
import axiosRetry from 'axios-retry';
import { SecureStateService } from "./secure-state.service";
import { UIState } from "./ui-state.service";
import { SettingsService } from "./settings.service";
import { BehaviorSubject, delay, Observable, of } from "rxjs";
import { NetworkLoader } from "../../shared/network-loader";
import { Network } from "../../shared/networks";
import { CommunicationService } from ".";
import { AccountHistoryStore, AddressStore, AddressWatchStore, WalletStore } from "src/shared";
import Big from "big.js";
import { StorageService } from "./storage.service";
import * as bip39 from "bip39";
const ECPair = ECPairFactory(ecc);
var bitcoinMessage = require('bitcoinjs-message');
const axios = require('axios').default;
axiosRetry(axios, { retries: 3 });

@Injectable({
    providedIn: 'root'
})
/** Manager that keeps state and operations for a single wallet. This object does not keep the password, which must be supplied for signing operations. */
export class WalletManager {
    private timer: any;
    private _activeWalletId: string;
    private _activeAccountId: string;
    private allNetworks: Network[];

    get activeWalletId() {
        return this._activeWalletId;
    }

    get activeAccountId() {
        return this._activeAccountId;
    }

    constructor(
        private networkLoader: NetworkLoader,
        private state: UIState,
        private crypto: CryptoUtility,
        private secure: SecureStateService,
        private store: WalletStore,
        private addressStore: AddressStore,
        private addressWatchStore: AddressWatchStore,
        private accountHistoryStore: AccountHistoryStore,
        private settings: SettingsService,
        private communication: CommunicationService,
        private storage: StorageService,
        private logger: LoggerService) {
        this.allNetworks = this.networkLoader.getAllNetworks();
    }

    get hasUnlockedWallets() {
        return (this.secure.unlockedWalletsSubject.value.length > 0);
    }

    get activeWalletUnlocked() {
        return (this.secure.get(this.activeWalletId) != null);
    }

    validateMnemonic( mnemonic: string) {
      return of(bip39.validateMnemonic(mnemonic)).pipe();
    }
    async save() {
        return this.store.save();
    }

    /** Get the network definition based upon the network identifier. */
    getNetwork(networkType: string) {
        return this.allNetworks.find(w => w.id == networkType);
    }

    async signData(wallet: Wallet, account: Account, address: string, content: string): Promise<string> {
        // TODO: Verify the address for this network!! ... Help the user avoid sending transactions on very wrong addresses.
        const network = this.getNetwork(account.networkType);

        // Get the address from receive or change.
        let addressItem = account.state.receive.find(a => a.address == address);
        let addressType = 0;

        if (!addressItem) {
            addressItem = account.state.change.find(a => a.address == address);
            addressType = 1;
        }

        // Get the secret seed.
        const masterSeedBase64 = this.secure.get(wallet.id);
        const masterSeed = Buffer.from(masterSeedBase64, 'base64');

        // Create the master node.
        const masterNode = HDKey.fromMasterSeed(masterSeed, network.bip32);

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

    // TODO: This method is duplicate of Indexer due to circular dependency after refactoring away from background process.
    async getTransactionHex(account: Account, txid: string) {
        const network = this.getNetwork(account.networkType);
        const indexerUrl = this.settings.values.indexer.replace('{id}', network.id.toLowerCase());

        const responseTransactionHex = await axios.get(`${indexerUrl}/api/query/transaction/${txid}/hex`);
        return responseTransactionHex.data;
    }

    // TODO: This method is duplicate of Indexer due to circular dependency after refactoring away from background process.
    async broadcastTransaction(account: Account, txhex: string) {
        // These two entries has been sent from
        const network = this.getNetwork(account.networkType);
        const indexerUrl = this.settings.values.indexer.replace('{id}', network.id.toLowerCase());

        const response = await axios.post(`${indexerUrl}/api/command/send`, txhex, {
            headers: {
                'Content-Type': 'application/json-patch+json',
            }
        });

        const data = response.data;

        this.logger.debug('Should contain transaction ID if broadcast was OK:', data);

        return data;
    }

    async createTransaction(wallet: Wallet, account: Account, address: string, changeAddress: string, amount: Big, fee: Big, unspent: AccountUnspentTransactionOutput[]): Promise<{ addresses: string[], transactionHex: string, fee: number, feeRate: number, virtualSize: number, weight: number }> {
        // TODO: Verify the address for this network!! ... Help the user avoid sending transactions on very wrong addresses.
        const network = this.getNetwork(account.networkType);
        console.log('NETWORK:', network);

        const affectedAddresses = [];

        // We currently only support BTC-compatible transactions such as STRAX. We do not support other Blockcore chains that are not PoS v4.
        const tx = new Psbt({ network: network, maximumFeeRate: 5000 });  // satoshi per byte, 5000 is default.
        tx.setVersion(1); // Lock-time is not used so set to 1 (defaults to 2).
        tx.setLocktime(0); // These are defaults. This line is not needed.

        console.log('unspent', unspent);

        // Collect unspent until we have enough amount.
        const requiredAmount = amount.add(fee);

        let aggregatedAmount = Big(0);
        const inputs: AccountUnspentTransactionOutput[] = [];

        for (let i = 0; i < unspent.length; i++) {
            const tx = unspent[i];
            aggregatedAmount = aggregatedAmount.plus(new Big(tx.balance));

            inputs.push(tx);

            if (aggregatedAmount.gte(requiredAmount)) {
                break;
            }
        }

        console.log('SELECTED INPUTS FOR TRANSACTION: ', inputs);

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            let hex = input.hex;

            // If we don't have the hex, retrieve it to be used in the transaction.
            // This was needed when hex retrieval was removed to optimize extremely large wallets.
            if (!hex) {
                hex = await this.getTransactionHex(account, input.transactionHash);
            }

            affectedAddresses.push(input.address);

            tx.addInput({
                hash: input.transactionHash,
                index: input.index,
                nonWitnessUtxo: Buffer.from(hex, 'hex')
            });
        }

        console.log('affectedAddresses: ', affectedAddresses);

        // Add the output the user requested.
        tx.addOutput({ address, value: amount.toNumber() });

        // Take the total sum of the aggregated inputs, remove the sendAmount and fee.
        const changeAmount = aggregatedAmount.minus(amount).minus(fee); //  Number(aggregatedAmount) - Number(amount) - Number(fee);

        // If there is any change amount left, make sure we send it to the user's change address.
        if (changeAmount > Big(0)) {
            // If the user has not supplied override on change address, get the change address automatically.
            if (changeAddress == null || changeAddress == '') {
                const changeAddressItem = await this.getChangeAddress(account);
                changeAddress = changeAddressItem.address;
            }

            // // Send the rest to change address.
            tx.addOutput({ address: changeAddress, value: changeAmount.toNumber() });
        }

        // Get the secret seed.
        const masterSeedBase64 = this.secure.get(wallet.id);
        const masterSeed = Buffer.from(masterSeedBase64, 'base64');

        // const secret = this.walletSecrets.get(wallet.id);

        // Create the master node.
        const masterNode = HDKey.fromMasterSeed(masterSeed, network.bip32);

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
        this.logger.debug('sendTransaction:TransactionHex', transactionHex);
        const transactionId = await this.broadcastTransaction(account, transactionHex);
        this.logger.debug('TransactionId', transactionId);
        return { transactionId, transactionHex };
    }

    getWallets() {
        return this.store.all();
    }

    lockWallet(id: string) {
        this.secure.set(id, undefined);
        // TODO: FIX!!!
        // this.manager.broadcastState();
    }

    async revealSecretRecoveryPhrase(walletId: string, password: string) {
        var wallet = this.getWallet(walletId);
        let unlockedMnemonic = null;

        if (!wallet) {
            return unlockedMnemonic;
        }

        try {
            unlockedMnemonic = await this.crypto.decryptData(wallet.mnemonic, password);
        }
        catch (error) {
            this.logger.error(error);
        }

        return unlockedMnemonic;
    }

    /** Returns list of wallet IDs that is currently unlocked. */
    get unlocked(): string[] {
        return this.secure.unlockedWalletsSubject.value;
    };

    /** Returns list of wallet IDs that is currently unlocked. */
    isUnlocked(walletId: string): boolean {
        return this.secure.unlockedWalletsSubject.value.indexOf(walletId) > -1;
    };

    async unlockWallet(walletId: string, password: string) {
        var wallet = this.getWallet(walletId);
        let unlockedMnemonic = null;

        if (!wallet) {
            return unlockedMnemonic;
        }

        unlockedMnemonic = await this.crypto.decryptData(wallet.mnemonic, password);

        if (unlockedMnemonic) {
            // this._activeWalletId = wallet.id;
            // this.state.persisted.previousWalletId = wallet.id;

            // From the secret receovery phrase, the master seed is derived.
            // Learn more about the HD keys: https://raw.githubusercontent.com/bitcoin/bips/master/bip-0032/derivation.png
            const masterSeed = mnemonicToSeedSync(unlockedMnemonic);

            // Store the decrypted master seed in session state.
            this.secure.set(walletId, Buffer.from(masterSeed).toString('base64'));

            await this.setActiveWallet(wallet.id);

            // Make sure we inform all instances when a wallet is unlocked.
            return true;

        } else {
            return false;
        }
    }

    /** Cange the wallet password in one operation. */
    async changeWalletPassword(walletId: string, oldpassword: string, newpassword: string) {
        var wallet = this.getWallet(walletId);
        let unlockedMnemonic = null;

        if (!wallet) {
            return unlockedMnemonic;
        }

        unlockedMnemonic = await this.crypto.decryptData(wallet.mnemonic, oldpassword);

        if (unlockedMnemonic) {
            // Encrypt the recovery phrase with new password and persist.
            let encryptedRecoveryPhrase = await this.crypto.encryptData(unlockedMnemonic, newpassword);
            wallet.mnemonic = encryptedRecoveryPhrase;

            // Make sure we persist the newly encrypted recovery phrase.
            await this.store.save();

            const masterSeed = mnemonicToSeedSync(unlockedMnemonic);

            // Store the decrypted master seed in session state.
            this.secure.set(walletId, Buffer.from(masterSeed).toString('base64'));

            return true;
        } else {
            return false;
        }
    }

    async resetTimer() {
        if (this.settings == null || this.settings.values == null) {
            return;
        }

        this.logger.info('resetTimer:', this.settings.values.autoTimeout * MINUTE);
        await this.storage.set('timeout', this.settings.values.autoTimeout * MINUTE);
        // await globalThis.chrome.storage.local.set({ 'timeout': this.settings.values.autoTimeout * MINUTE });

        // Set the active date from startup.
        // await globalThis.chrome.storage.local.set({ 'active': new Date().toJSON() });
        await this.storage.set('active', new Date().toJSON());
    }

    get hasWallets(): boolean {
        return this.getWallets().length > 0;
    }

    activeAccountSubject: BehaviorSubject<Account | undefined> = new BehaviorSubject<Account | undefined>(undefined);

    public get activeAccount$(): Observable<Account | undefined> {
        return this.activeAccountSubject.asObservable();
    }

    activeWalletSubject: BehaviorSubject<Wallet | undefined> = new BehaviorSubject<Wallet | undefined>(undefined);

    public get activeWallet$(): Observable<Wallet | undefined> {
        return this.activeWalletSubject.asObservable();
    }

    get activeWallet() {
        return this.store.get(this._activeWalletId);
    }

    get activeAccount() {
        if (!this.activeWallet) {
            return undefined;
        }

        const activeWallet = this.activeWallet;

        if (!activeWallet.accounts) {
            return undefined;
        }

        if (this.activeAccountId == null) {
            return undefined;
        }

        const accountIndex = activeWallet.accounts.findIndex(a => a.identifier == this.activeAccountId);

        // This can happen if the wallet has changed but not the account identifier. When this happens, we'll reset the active account ID.
        if (accountIndex === -1) {
            this._activeAccountId = null;
            return undefined;
        }

        return this.activeWallet.accounts[accountIndex];
    }

    // hasAccounts(wallet: Wallet): boolean {
    //     return wallet.accounts?.length > 0;
    // }

    get hasAccounts(): boolean {
        return this.activeWallet.accounts?.length > 0;
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
        return this.secure.unlocked(this.activeWallet.id);
    }

    async setActiveWallet(id: string) {
        console.log('WalletManager:setActiveWallet:' + id);

        if (this.activeWalletId != id) {
            this._activeWalletId = id;
            this.state.persisted.previousWalletId = id;

            // await this.store.save();
            await this.state.save();

            this.activeWalletSubject.next(this.activeWallet);

            return true;
        }

        return false;
    }

    async setActiveAccount(id: string) {
        console.log('WalletManager:setActiveAccount:' + id);

        if (this.activeAccountId != id) {
            this._activeAccountId = id;
            this.state.persisted.previousAccountId = id;

            await this.state.save();

            this.activeAccountSubject.next(this.activeAccount);

            return true;
        }

        return false;
    }

    getAccount(wallet: Wallet, accountId: string) {
        return wallet.accounts.find(a => a.identifier == accountId);
    }

    count() {
        return this.getWallets().length;
    }

    getWallet(id: string) {
        return this.store.get(id);
    }

    private removeAccountHistory(account: Account) {
        const addresses = [...account.state.receive, ...account.state.change].map(a => a.address);

        for (let j = 0; j < addresses.length; j++) {
            const address = addresses[j];
            this.addressWatchStore.remove(address);
            this.addressStore.remove(address);
        }

        this.accountHistoryStore.remove(account.identifier);
    }

    private async saveAndUpdate() {
        await this.store.save();
        await this.addressWatchStore.save();
        await this.addressStore.save();
        await this.accountHistoryStore.save();

        this.updateAllInstances();
    }

    async removeAccount(walletId: string, accountId: string) {
        const wallet = this.getWallet(walletId);

        if (!wallet) {
            console.warn('Attempting to remove account from a non-existing wallet.');
            return;
        }

        const accountIndex = wallet.accounts.findIndex(a => a.identifier == accountId);

        try {
            const account = wallet.accounts[accountIndex];
            this.removeAccountHistory(account);
        }
        catch (err) {
            console.log('Failed to remove account history.');
            console.error(err);
        }

        // Remove from accounts list.
        wallet.accounts.splice(accountIndex, 1);

        this._activeAccountId = null;
        // wallet.activeAccountId = null;
        // if (wallet.accounts.length > 0) {
        //     // wallet.activeAccountId = wallet.accounts[0].identifier;
        // } else {
        //     wallet.activeAccountId = null;
        // }

        await this.saveAndUpdate();
    }

    async removeWallet(id: string) {
        // Which stores holds wallet information?
        // WalletStore
        // AddressStore
        // AccountHistoryStore
        // AddressWatchStore
        // TransactionStore (we won't remove txs, as we will need to ensure they are not used in other account/wallets.)

        const wallet = this.getWallet(id);

        if (!wallet) {
            return;
        }

        try {
            for (let i = 0; i < wallet.accounts.length; i++) {
                const account = wallet.accounts[i];
                this.removeAccountHistory(account);
            }
        }
        catch
        {

        }

        this.store.remove(id);

        // Remove the seed from the secrets.
        this.secure.set(id, undefined);

        this.saveAndUpdate();
    }

    updateAllInstances() {
        chrome.runtime.sendMessage({
            type: 'reload',
            ext: 'blockcore',
            source: 'tab',
            target: 'tabs',
            host: location.host
        }, function (response) {
            console.log('Extension:sendMessage:response:updated:', response);
        });
    }

    async addAccount(account: Account, wallet: Wallet, runIndexIfRestored = true) {
        // First derive the xpub and store that on the account.
        // const secret = this.walletSecrets.get(wallet.id);
        // Get the secret seed.
        const masterSeedBase64 = this.secure.get(wallet.id);
        const masterSeed = Buffer.from(masterSeedBase64, 'base64');

        const network = this.getNetwork(account.networkType);

        const masterNode = HDKey.fromMasterSeed(masterSeed, network.bip32);

        const accountNode = masterNode.derive(`m/${account.purpose}'/${account.network}'/${account.index}'`);

        account.xpub = accountNode.publicExtendedKey;

        // Add account to the wallet and persist.
        wallet.accounts.push(account);

        // Update the active account index to new account.
        this.state.persisted.previousAccountId = account.identifier;
        this._activeAccountId = account.identifier;

        // After new account has been added and set as active, we'll generate some addresses:

        // Generate the first receive address.
        await this.getReceiveAddress(account);

        // Generate the first change address.
        await this.getChangeAddress(account);

        await this.store.save();
        await this.state.save();

        // If the wallet type is restored, force an index process to restore the state.
        if (wallet.restored && runIndexIfRestored == true) {
            const msg = this.communication.createMessage('index', { force: true }, 'background');
            this.communication.send(msg);
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

    private async getAddress(account: Account, type: number, addresses: Address[]) {
        const index = addresses.length - 1;

        // Get the last index without know transactions:
        let address = addresses[index];

        if (address == null || this.hasBeenUsed(address)) {
            // Generate a new address.
            const addressIndex = index + 1;

            const network = this.getNetwork(account.networkType);
            const accountNode = HDKey.fromExtendedKey(account.xpub, network.bip32);
            const addressNode = accountNode.deriveChild(type).deriveChild(addressIndex);
            const address = this.crypto.getAddressByNetwork(Buffer.from(addressNode.publicKey), network, account.purposeAddress);

            addresses.push({
                index: addressIndex,
                address: address
            });

            await this.store.save();
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
        this.store.set(wallet.id, wallet);

        // This will save it.
        await this.setActiveWallet(wallet.id);

        // Persist the newly created wallet.
        // await this.store.save();
    }
}
