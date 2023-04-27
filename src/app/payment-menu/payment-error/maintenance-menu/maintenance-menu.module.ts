import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceMenuPageRoutingModule } from './maintenance-menu-routing.module';

import { MaintenanceMenuPage } from './maintenance-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceMenuPageRoutingModule
  ],
  declarations: [MaintenanceMenuPage]
})
export class MaintenanceMenuPageModule {}
