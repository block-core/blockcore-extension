import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { LoggerService, UIState, WalletManager } from '../../services';

@Component({
  selector: 'app-account-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['../account.component.css']
})
export class AccountRemoveComponent {
  constructor(
    private router: Router,
    private location: Location,
    public uiState: UIState,
    private logger: LoggerService,
    public walletManager: WalletManager,
    private activatedRoute: ActivatedRoute,
  ) {
    this.uiState.title = 'Remove Account';

    this.activatedRoute.paramMap.subscribe(async params => {

      const accountId: any = params.get('index');
      const accountCount = this.walletManager.activeWallet?.accounts?.length;

      if (this.walletManager.activeWallet) {
        // Check if the index is available before allowing to change.
        if (accountId && accountCount != null) {
          // this.walletManager.activeWallet.activeAccountId = accountId;
        }
        else {
          this.logger.warn('Attempting to show account that does not exists.');
          this.router.navigateByUrl('/account');
        }
      }
      else {
        this.logger.warn('Attempting to show account when no wallet is selected.');
        this.router.navigateByUrl('/');
      }
    });
  }

  async wipe() {
    if (!this.walletManager.activeWallet) {
      return;
    }

    var activeWallet = this.walletManager.activeWallet;

    await this.walletManager.removeAccount(activeWallet.id, this.walletManager.activeAccountId);

    this.router.navigateByUrl('/dashboard');
  }

  cancel() {
    this.location.back();
  }
}
