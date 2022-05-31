import { Network } from './network';

export class SBC implements Network {
    singleAddress?: boolean;
    isProofOfStake?: boolean;
    SmartContractSupport: boolean;
    id: string = 'SBC';
    name: string = 'Senior';
    symbol = 'SBC';
    network: number = 5006;
    purpose: number = 84;
    messagePrefix = '\x18SBC Signed Message:\n';
    bech32 = 'sbc';
    bip32 = {
        public: 0x0488b21e,
        private: 0x0488ade4,
    };
    pubKeyHash = 63;
    scriptHash = 125;
    wif = 0x08;
    feeRate = 10000;
    minFeeRate = 10000;
    testnet = false;
}
