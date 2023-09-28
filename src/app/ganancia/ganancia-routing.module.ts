import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GananciaPage } from './ganancia.page';

const routes: Routes = [
  {
    path: '',
    component: GananciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GananciaPageRoutingModule {}
