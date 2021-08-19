import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddeditPageRoutingModule } from './addedit-routing.module';

import { AddeditPage } from './addedit.page';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddeditPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddeditPage]
})
export class AddeditPageModule {}
