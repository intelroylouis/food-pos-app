import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MugMessagePageRoutingModule } from './mug-message-routing.module';

import { MugMessagePage } from './mug-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MugMessagePageRoutingModule
  ],
  declarations: [MugMessagePage]
})
export class MugMessagePageModule {}
