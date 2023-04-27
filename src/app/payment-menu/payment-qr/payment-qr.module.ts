import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentQrPageRoutingModule } from './payment-qr-routing.module';

import { PaymentQrPage } from './payment-qr.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { CartCheckPageModule } from 'src/app/pages/cart-check/cart-check.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentQrPageRoutingModule,
        FontAwesomeModule,
        CartCheckPageModule
    ],
  declarations: [PaymentQrPage]
})
export class PaymentQrPageModule {}
