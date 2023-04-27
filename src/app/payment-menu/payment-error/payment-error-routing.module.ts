import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentErrorPage } from './payment-error.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentErrorPage
  },
  {
    path: 'error-maintenance',
    loadChildren: () => import('./error-maintenance/error-maintenance.module').then( m => m.ErrorMaintenancePageModule)
  },
  {
    path: 'maintenance-menu',
    loadChildren: () => import('./maintenance-menu/maintenance-menu.module').then( m => m.MaintenanceMenuPageModule)
  },
  {
    path: 'read-value-wait',
    loadChildren: () => import('./read-value-wait/read-value-wait.module').then( m => m.ReadValueWaitPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentErrorPageRoutingModule {}
