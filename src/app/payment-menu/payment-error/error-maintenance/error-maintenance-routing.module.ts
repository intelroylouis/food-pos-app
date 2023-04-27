import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorMaintenancePage } from './error-maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorMaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorMaintenancePageRoutingModule {}
