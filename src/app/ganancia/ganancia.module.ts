import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GananciaPageRoutingModule } from './ganancia-routing.module';

import { GananciaPage } from './ganancia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GananciaPageRoutingModule
  ],
  declarations: [GananciaPage]
})
export class GananciaPageModule {}
