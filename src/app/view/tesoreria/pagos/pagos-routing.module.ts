import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobacionComponent } from './aprobacion/aprobacion.component';
import { EmisionComponent } from './emision/emision.component';
import { OrdenComponent } from './orden/orden.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ReportesPagosComponent } from './reportes-pagos/reportes-pagos.component';
import { ActivosFinancierosComponent } from './activos-financieros/activos-financieros.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'tesoreria/pagos'
    },
    children: [
      {
        path: 'orden',
        component: OrdenComponent
      },
      {
        path: 'aprobacion',
        component: AprobacionComponent
      },
      {
        path: 'emision',
        component: EmisionComponent
      },
      {
        path: 'consulta',
        component: ConsultaComponent
      },
      {
        path: 'reporte',
        component: ReportesPagosComponent
      },
      {
        path: 'activos-financieros',
        loadChildren: ()=>import('./activos-financieros/activos-financieros.module').then(m=>m.ActivosFinancierosModule)
      },
      {
        path: 'cruce-pagos',
        loadChildren: ()=>import('./cruce-pagos/cruce-pagos.module').then(m=>m.CrucePagosModule)
      },
      {
        path: 'tabla-amorti',
        loadChildren: ()=>import('./tabla-amortizacion/tabla-amortizacion.module').then(m=>m.TablaAmortizacionModule)
      },
      {
        path: 'flujo-de-caja',
        loadChildren: ()=>import('./flujo-de-caja/flujo-de-caja.module').then(m=>m.FlujoCajanModule)
      },
      {
        path: 'flujo-de-caja-proyectado',
        loadChildren: ()=>import('./flujo-de-caja-proyectado/flujo-de-caja-proyectado.module').then(m=>m.FlujoCajaProyectadoModule)  
      },
      {
        path: 'proyeccion-de-gastos',
        loadChildren: ()=>import('./proyeccion-de-gastos/proyeccion-de-gastos.module').then(m=>m.ProyeccionGastosModule)
      },
      {
        path: 'consulta-pagos',
        loadChildren: ()=>import('./consulta-pagos/consulta-pagos.module').then(m=>m.ConsultaPagosModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule { }
