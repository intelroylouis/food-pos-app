import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadValueWaitPageRoutingModule } from './read-value-wait-routing.module';

import { ReadValueWaitPage } from './read-value-wait.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadValueWaitPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [ReadValueWaitPage]
})
export class ReadValueWaitPageModule {}
