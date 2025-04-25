import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'contratacion',
        loadChildren: () => import('./contratacion/contratacion.module').then(m => m.ContratacionModule),
      },
      {
        path: 'infimas',
        loadChildren: () => import('./infimas/infimas.module').then(m => m.InfimasModule),
      },
      {
        path: 'catalogo-electronico',
        loadChildren: () => import('./catalogo-electronico/catalogo-electronico.module').then(m => m.CatalogoElectronicoModule),
      },
      {
        path: 'solicitud',
        loadChildren: ()=> import('./solicitud/solicitud.module').then(m => m.SolicitudModule)
      },
      {
        path: 'aprobacion',
        loadChildren: () => import('./aprobacion/aprobacion-compras.module').then(m => m.AprobacionComprasModule)
      },
      {
        path: 'proveedores',
        loadChildren: () => import('./proveedores/proveedores.module').then(m => m.ProveedoresModule)
      },
      {
        path: 'consulta-proveedores',
        loadChildren: () => import('./consulta-proveedores/consulta-proveedores.module').then(m => m.ConsultaProveedoresModule)
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasPublicasRoutingModule { }
