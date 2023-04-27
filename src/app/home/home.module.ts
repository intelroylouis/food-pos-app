import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CartModalPageModule } from '../pages/cart-modal/cart-modal.module';

import { HomePageRoutingModule } from './home-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        NgxPaginationModule,
        HttpClientModule,
        CartModalPageModule,
        FontAwesomeModule,
    ],
  declarations: [HomePage],
  exports: [HomePage]
})
export class HomePageModule {}
