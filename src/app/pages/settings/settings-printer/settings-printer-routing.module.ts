import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPrinterPage } from './settings-printer.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPrinterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPrinterPageRoutingModule {}
