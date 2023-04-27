import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { ReportModalPageModule } from '../../pages/report-modal/report-modal.module';
// import { ClickDirective } from '../../directive/click.directive';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ReportModalPageModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
