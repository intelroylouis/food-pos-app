import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertMessagePage } from './alert-message.page';

const routes: Routes = [
  {
    path: '',
    component: AlertMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertMessagePageRoutingModule {}
