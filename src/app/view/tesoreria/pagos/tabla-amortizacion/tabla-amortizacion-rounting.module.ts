import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaAmortizacionComponent } from './tabla-amortizacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'reporte'
    },
    children: [
      {
        path: '',
        component: TablaAmortizacionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablaAmortizacionRoutingModule
{ }
