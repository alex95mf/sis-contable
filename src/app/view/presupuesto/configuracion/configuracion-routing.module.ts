import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'presupuesto/configuracion/'
    },
    children: [
      {
        path: 'asignacion-ingresos',
        loadChildren: () => import('./asignacion-ingresos/asignacion-ingresos.module').then(m => m.AsignacionIngresosModule)
      },
      {
        path: 'cedula-gastos',
        loadChildren: () => import('./cedula-gastos/cedula-gastos.module').then(m => m.AsignacionIngresosModule)
      },
      {
        path: 'generacion-idp',
        loadChildren: () => import('./generacion-idp/generacion-idp.module').then(m => m.GeneracionIdpModule)
      }, 
      {
        path: 'generacion-icp',
        loadChildren: () => import('./generacion-icp/generacion-icp.module').then(m => m.GeneracionIcpModule)
      },
      {
        path: 'generacion-icp-nomina',
        loadChildren: () => import('./generacion-icp-nomina/generacion-icp-nomina.module').then(m => m.GeneracionIcpNominaModule)
      },
      {
        path: 'generacion-idp-nomina',
        loadChildren: () => import('./generacion-idp-nomina/generacion-idp-nomina.module').then(m => m.GeneracionIdpNominaModule)
      },
      {
        path: 'reforma',
        loadChildren: ()=>import('./reforma/reforma.module').then(m=>m.ReformaModule)
      },
      {
        path: 'bandeja',
        loadChildren: ()=>import('./bandeja/bandeja.module').then(m=>m.BandejaModule)
      },
      {
        path: 'cierre-periodo',
        loadChildren: () => import('./cierre-de-mes/cierre-de-mes.module').then(m => m.CierreDeMesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
