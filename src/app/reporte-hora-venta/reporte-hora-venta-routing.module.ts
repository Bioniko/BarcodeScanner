import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteHoraVentaPage } from './reporte-hora-venta.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteHoraVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteHoraVentaPageRoutingModule {}
