import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorMaintenancePageRoutingModule } from './error-maintenance-routing.module';

import { ErrorMaintenancePage } from './error-maintenance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorMaintenancePageRoutingModule
  ],
  declarations: [ErrorMaintenancePage]
})
export class ErrorMaintenancePageModule {}
