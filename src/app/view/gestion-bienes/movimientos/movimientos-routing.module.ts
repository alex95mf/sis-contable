import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'bienes/movimientos'
    },
    children: [
      {
        path: 'ingresos-bodega',
        loadChildren: () => import('./ingreso-bodega/ingreso-bodega.module').then(m => m.IngresoBodegaModule)
      },
      {
        path: 'egresos-bodega',
        loadChildren: () => import('./egresos-bodega/egresos-bodega.module').then(m => m.EgresosBodegaModule)
      },
      {
        path: 'traslado',
        loadChildren: () => import('./traslado/traslado.module').then(m => m.TrasladoModule)
      },
      {
        path:'constatacion-fisica',
        loadChildren: ()=> import('./constatacion-fisica/constatacion-fisica.module').then(m=>m.ConstatacionFisicaModule)
      },
      {
        path: 'depreciacion',
        loadChildren: () => import('./depreciacion/depreciacion.module').then(m => m.DepreciacionModule)
      },
      {
        path: 'prestamo',
        loadChildren: () => import('./prestamo/prestamo.module').then(m=> m.PrestamoModule)
      },
      {
        path:'constatacion-fisica-BCA',
        loadChildren: ()=> import('./constatacion-fisica-bca/constatacion-fisica-bca.module').then(m=>m.ConstatacionFisicaBCAModule)
      },
      {
        path: 'mantenimiento',
        loadChildren: ()=>import('./mantenimiento/mantenimiento.module').then(m=>m.MantenimientoModule)
      },
      {
        path: 'registro-poliza',
        loadChildren: ()=>import('./registro-poliza/registro-poliza.module').then(m=>m.RegistroPolizaModule)
      },
      {
        path: 'reclasificacion',
        loadChildren: () => import('./reclasificacion/reclasificacion.module').then(m => m.ReclasificacionModule)
      },
      {
        path: 'cierre-bienes',
        loadChildren: () => import('./cierre-bienes/cierre-bienes.module').then(m => m.CierreBienesModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
