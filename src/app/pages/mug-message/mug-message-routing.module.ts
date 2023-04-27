import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MugMessagePage } from './mug-message.page';

const routes: Routes = [
  {
    path: '',
    component: MugMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MugMessagePageRoutingModule {}
