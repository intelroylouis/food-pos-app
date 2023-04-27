import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadValuePage } from './read-value.page';

const routes: Routes = [
  {
    path: '',
    component: ReadValuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadValuePageRoutingModule {}
