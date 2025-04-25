import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'subida',
    loadChildren: () => import('./subida/subida.module').then(m => m.SubidaModule),
  },
  {
    path: 'consulta-directorio',
    loadChildren: () => import('./consulta-directorio/consulta-directorio.module').then(m => m.ConsultaDirectorioModule),
  },
  {
    path: 'reservas',
    loadChildren: () => import('./solicitud/solicitud.module').then(m => m.SolicitudModule),
  },
  {
    path: 'asignacion',
    loadChildren: () => import('./asignacion/asignacion.module').then(m => m.AsignacionModule),
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
