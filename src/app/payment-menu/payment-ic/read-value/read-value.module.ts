import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadValuePageRoutingModule } from './read-value-routing.module';

import { ReadValuePage } from './read-value.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadValuePageRoutingModule
  ],
  declarations: [ReadValuePage]
})
export class ReadValuePageModule {}
