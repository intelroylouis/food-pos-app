import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EatinMessagePage } from './eatin-message.page';

const routes: Routes = [
  {
    path: '',
    component: EatinMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EatinMessagePageRoutingModule {}
