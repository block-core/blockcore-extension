import { Account, Address } from "./interfaces";
import { HDKey } from "micro-bip32";
import { payments } from '@blockcore/blockcore-js';
import { NetworkLoader } from "./network-loader";
import { Network } from "./networks";

export class AddressManager {

    private allNetworks: Network[];

    constructor(public networkLoader: NetworkLoader) {
        this.allNetworks = this.networkLoader.getAllNetworks();
    }

    getAddress(account: Account, type: number, index: number): Address {
        const network = this.getNetwork(account.networkType);
        const accountNode = HDKey.fromExtendedKey(account.xpub, network.bip32);
        const addressNode = accountNode.deriveChild(type).deriveChild(index);
        const address = this.getAddressByNetwork(Buffer.from(addressNode.publicKey), network, account.purposeAddress);

        return {
            index: index,
            address: address
        };
    }

    /** Get the network definition based upon the network identifier. */
    getNetwork(networkType: string) {
        return this.allNetworks.find(w => w.id == networkType);
    }

    // private generateRandomNumber(min: number, max: number) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    // getServer(networkType: string, networkGroup: string, customServer?: string) {
    //     if (networkGroup == 'custom') {
    //         const server = customServer.replace('{id}', networkGroup.toLowerCase());
    //     } else {
    //         const serversGroup = Servers[networkGroup];
    //         const servers = serversGroup[networkType];

    //         // TODO: Figure out the best way to pick and perhaps cycle the servers.
    //         // As of now, we'll randomly pick every time this method is called.
    //         const serverIndex = this.generateRandomNumber(0, servers.length);
    //         const server = servers[serverIndex];

    //         return server;
    //     }
    // }

    getAddressByNetwork(publicKey: Buffer, network: any, addressPurpose: number) {
        if (addressPurpose == 44) {
            const { address } = payments.p2pkh({
                pubkey: publicKey,
                network: network,
            });

            return address;
        } else if (addressPurpose == 49) {
            throw Error(`The address purpose ${addressPurpose} is currently not supported.`);

            // const { address } = payments.p2wsh({
            //     pubkey: publicKey,
            //     network: network,
            // });

            // return address;
        } else if (addressPurpose == 84) {
            const { address } = payments.p2wpkh({
                pubkey: publicKey,
                network: network,
            });

            return address;
        } else if (addressPurpose == 302) {
            // TODO: Fix this to properly generate the DID:
            return `did:is:${publicKey.toString('hex')}`;
        }

        throw Error(`The address purpose ${addressPurpose} is currently not supported.`);
    }

    getAddressByNetworkp2wsh(node: any, network: any) {
        const { address } = payments.p2wsh({
            pubkey: node.publicKey,
            network: network,
        });

        return address;
    }

    getAddressByNetworkp2pkh(node: any, network: any) {
        const { address } = payments.p2pkh({
            pubkey: node.publicKey,
            network: network,
        });

        return address;
    }

    getAddressByNetworkp2pkhFromBuffer(publicKey: Buffer, network: any) {
        const { address } = payments.p2pkh({
            pubkey: publicKey,
            network: network,
        });

        return address;
    }

    getAddressByNetworkp2wpkh(node: any, network: any) {
        const { address } = payments.p2wpkh({
            pubkey: node.publicKey,
            network: network,
        });

        return address;
    }

}
