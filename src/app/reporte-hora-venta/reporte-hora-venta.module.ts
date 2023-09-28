import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteHoraVentaPageRoutingModule } from './reporte-hora-venta-routing.module';

import { ReporteHoraVentaPage } from './reporte-hora-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteHoraVentaPageRoutingModule
  ],
  declarations: [ReporteHoraVentaPage]
})
export class ReporteHoraVentaPageModule {}
