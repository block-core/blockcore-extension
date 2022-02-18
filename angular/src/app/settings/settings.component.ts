import { Component, Renderer2 } from '@angular/core';
import { UIState } from '../services/ui-state.service';
import { Location } from '@angular/common'
import { OrchestratorService } from '../services/orchestrator.service';
import { Settings } from '../interfaces';
import { OverlayContainer } from '@angular/cdk/overlay';
import { environment } from '../../environments/environment';
import { INDEXER_URL } from '../shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { FeatureService } from '../services/features.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  settings: Settings;
  theme: string = 'dark';
  themeColor: 'primary' | 'accent' | 'warn' = 'accent';
  isDark = false;
  env: any;

  constructor(
    private renderer: Renderer2,
    public uiState: UIState,
    public translate: TranslateService,
    private manager: OrchestratorService,
    public feature: FeatureService,
    private location: Location) {

    this.env = environment;

    // Reset to default if missing.
    if (!this.uiState.persisted.settings.indexer) {
      this.uiState.persisted.settings.indexer = INDEXER_URL;
    }

    // Clone the settings on load:
    this.settings = JSON.parse(JSON.stringify(this.uiState.persisted.settings));
    this.uiState.title = 'Settings';
    this.uiState.showBackButton = true;
  }

  async save() {
    // this.manager.setLockTimer(this.autoTimeout);
    this.manager.setSettings(this.settings);
    this.location.back();
  }

  onThemeChanged(event: any) {
    if (this.settings.theme === 'light') {
      this.renderer.removeClass(document.body, 'dark-theme');
    } else {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }

  onLanguageChanged(event: any) {
    this.translate.use(this.settings.language)

    // if (this.settings.theme === 'light') {
    //   this.renderer.removeClass(document.body, 'dark-theme');
    // } else {
    //   this.renderer.addClass(document.body, 'dark-theme');
    // }
  }

  onAccentChanged(event: any) {
    console.log(this.settings);
  }
}
