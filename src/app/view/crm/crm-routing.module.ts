import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




const routes: Routes = [
 
  {
    path: 'mantenimiento',
    loadChildren: () => import('./mantenimiento/mantenimiento.module').then(m => m.MantenimientoModule),
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reportes/reportes-routing.module').then(m => m.ReportesRoutingModule),
  }
,
   {
     path: 'procesos',
     loadChildren: () => import('./procesos/procesos.module').then(m => m.ProcesosModule),
   },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
