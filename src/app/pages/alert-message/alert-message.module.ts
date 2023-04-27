import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertMessagePageRoutingModule } from './alert-message-routing.module';

import { AlertMessagePage } from './alert-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertMessagePageRoutingModule
  ],
  declarations: [AlertMessagePage]
})
export class AlertMessagePageModule {}
