import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountHistoryStore, AddressState, AddressStore, TransactionStore } from 'src/shared';
import { AccountStateStore } from 'src/shared/store/account-state-store';
import { AddressWatchStore } from 'src/shared/store/address-watch-store';
import { CommunicationService, SendService, UIState, WalletManager } from '../../../services';

@Component({
    selector: 'app-account-send-sending',
    templateUrl: './send-sending.component.html',
    styleUrls: ['./send-sending.component.css']
})
export class AccountSendSidechainSendingComponent implements OnInit, OnDestroy {

    constructor(
        private router: Router,
        public sendService: SendService,
        private communication: CommunicationService,
        public walletManager: WalletManager,
        private addressWatchStore: AddressWatchStore,
        private accountHistoryStore: AccountHistoryStore,
        private accountStateStore: AccountStateStore,
        private addressStore: AddressStore,
        private transactionStore: TransactionStore,
        public uiState: UIState) {
        // When the transaction is done, we'll make sure the back button sends back to home.
        this.uiState.goBackHome = true;
    }

    ngOnDestroy() {

    }

    async ngOnInit() {
        this.sendService.loading = true;

        const transactionDetails = await this.walletManager.sendTransaction(this.sendService.account, this.sendService.transactionHex);

        this.sendService.loading = false;
        this.sendService.transactionId = transactionDetails.transactionId;
        this.sendService.transactionHex = transactionDetails.transactionHex;

        // Reload the watch store to ensure we have latest state, the watcher might have updated (and removed) some values.
        await this.addressWatchStore.load();

        await this.accountStateStore.load();

        const accountState = this.accountStateStore.get(this.sendService.account.identifier);

        for (let i = 0; i < this.sendService.addresses.length; i++) {
            const address = this.sendService.addresses[i];

            let index = accountState.receive.findIndex(a => a.address == address);

            if (index === -1) {
                index = accountState.change.findIndex(a => a.address == address);
            }

            // If we cannot find the address that is involved with this transaction, don't add a watch.
            if (index > -1) {
                this.addressWatchStore.set(address, {
                    address,
                    accountId: this.sendService.account.identifier,
                    count: 0
                });
            }
        }

        // Save the watch store so the background watcher will see the new entries.
        await this.addressWatchStore.save();

        // Trigger watch process to start immediately now that we've broadcasted a new transaction.
        this.communication.send(this.communication.createMessage('watch', {}, 'background'));

        // TODO: Parse the transaction locally and update the local UI state to match the future state of the indexer, ensuring 
        // a good user experience where the transaction is displayed in the history immediately. This requires updating multiple
        // stores.
        // this.transactionStore.set(this.sendService.transactionId, {
        //     blockIndex: 0,
        //     confirmations: 0,
        //     entryType: 'send',
        //     value: this.sendService.total.toNumber(),
        //     transactionHash: this.sendService.transactionId,
        //     hex: this.sendService.transactionHex,
        //     details: {
        //         transactionId: this.sendService.transactionId,
        //         blockHash: '',
        //         blockIndex: 0,
        //         confirmations: 0,
        //         fee: this.sendService.feeAsSatoshi.toNumber(),
        //         symbol: '',
        //         timestamp: 0,
        //         isCoinbase: false,
        //         isCoinstake: false,
        //         rbf: false,
        //         lockTime: 'Height : 0',
        //         version: 1,
        //         inputs: [],
        //         outputs: []
        //     }
        // });

        this.router.navigateByUrl('/account/send/success');
    }
}