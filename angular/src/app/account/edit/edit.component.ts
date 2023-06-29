import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { UIState, IconService, WalletManager } from '../../services';
import { CommunicationService } from '../../services/communication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../account.component.css']
})
export class AccountEditComponent implements OnInit, OnDestroy {

  accountName: string | undefined;
  sub2: any;
  icon: string | undefined;
  color: string | undefined;

  constructor(
    private router: Router,
    private location: Location,
    public uiState: UIState,
    public icons: IconService,
    private communication: CommunicationService,
    public walletManager: WalletManager,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
  ) {

    this.activatedRoute.paramMap.subscribe(async params => {
      const index: any = params.get('index');

      if (!this.walletManager.activeWallet) {
        return;
      }

      await this.walletManager.setActiveAccount(index);
      // this.manager.setActiveAccountId(index);
      this.accountName = this.walletManager.activeAccount?.name;
      this.icon = this.walletManager.activeAccount?.icon;
      this.color = this.walletManager.activeAccount?.color;
    });

    this.sub2 = this.walletManager.activeAccount$.subscribe(() => {
      this.accountName = this.walletManager.activeAccount?.name;
      this.icon = this.walletManager.activeAccount?.icon;
      this.color = this.walletManager.activeAccount?.color;
    });
  }

  async ngOnInit() {
    this.uiState.title = await this.translate.get('Account.EditAccount').toPromise();
  }

  changeIcon(icon: string) {
    if (this.walletManager.activeAccount) {
      this.walletManager.activeAccount.icon = icon;
    }
  }

  ngOnDestroy(): void {
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  async save() {
    if (!this.walletManager.activeWallet) {
      this.location.back();
      return;
    }

    // We won't allow empty names for accounts.
    if (this.accountName) {
      const wallet = this.walletManager.activeWallet;
      const accountId = this.walletManager.activeAccountId;

      if (!wallet) {
        return;
      }

      const accountIndex = wallet.accounts.findIndex(a => a.identifier == accountId);
      const account = wallet.accounts[accountIndex];
      account.name = this.accountName;
      account.icon = this.icon;
      account.color = this.color;

      await this.walletManager.save();

      this.location.back();
    }
  }

  cancel() {
    this.location.back();
  }
}
