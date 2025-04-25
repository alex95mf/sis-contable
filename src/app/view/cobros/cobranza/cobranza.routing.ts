import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioConceptosComponent } from './formulario-conceptos/formulario-conceptos.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'cobros/cobranza'
    },
    children: [
        {
          path: 'formulario-conceptos',
          loadChildren: ()=> import('./formulario-conceptos/formulario-conceptos.module').then(m=>m.FormularioConceptosModule)
        },
        {
          path: 'gestion-cobranza',
          loadChildren: ()=> import('./formulario-nuevo/formulario-nuevo.module').then(m=>m.FormularioNuevoModule)
        },
        {
          path: 'gestion-notificaciones',
          loadChildren: ()=> import('./formulario-notificaciones/formulario-notificaciones.module').then(m=>m.FormularioNotificacionesModule)
        },
        {
          path: 'reporte',
          loadChildren: ()=> import('./reporte/reporte.module').then(m=>m.ReporteModule)
        }
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobranzaRoutingModule { }
