import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMenuPageRoutingModule } from './payment-menu-routing.module';

import { PaymentMenuPage } from './payment-menu.page';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentMenuPageRoutingModule,
        FontAwesomeModule
    ],
  declarations: [PaymentMenuPage]
})
export class PaymentMenuPageModule {}
