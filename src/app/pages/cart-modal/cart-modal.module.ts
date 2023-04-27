import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartModalPageRoutingModule } from './cart-modal-routing.module';

import { CartModalPage } from './cart-modal.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CartModalPageRoutingModule,
        FontAwesomeModule
    ],
  exports: [CartModalPage],
  declarations: [CartModalPage]
})
export class CartModalPageModule {}
