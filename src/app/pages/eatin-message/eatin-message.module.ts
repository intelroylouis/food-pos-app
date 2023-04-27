import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EatinMessagePageRoutingModule } from './eatin-message-routing.module';

import { EatinMessagePage } from './eatin-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatinMessagePageRoutingModule
  ],
  declarations: [EatinMessagePage]
})
export class EatinMessagePageModule {}
