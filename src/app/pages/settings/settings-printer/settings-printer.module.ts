import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPrinterPageRoutingModule } from './settings-printer-routing.module';

import { SettingsPrinterPage } from './settings-printer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPrinterPageRoutingModule
  ],
  declarations: [SettingsPrinterPage]
})
export class SettingsPrinterPageModule {}
