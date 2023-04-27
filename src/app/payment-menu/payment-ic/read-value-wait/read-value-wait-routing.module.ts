import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadValueWaitPage } from './read-value-wait.page';

const routes: Routes = [
  {
    path: '',
    component: ReadValueWaitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadValueWaitPageRoutingModule {}
