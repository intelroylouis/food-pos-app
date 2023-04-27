import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceMenuPage } from './maintenance-menu.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceMenuPageRoutingModule {}
