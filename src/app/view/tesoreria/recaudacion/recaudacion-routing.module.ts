import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'tesoreria/recaudacion'
    },
    children: [
        {
            path: 'recibo-cobro',
            loadChildren: () => import('./recibo-cobro/recibo-cobro.module').then(m => m.ReciboCobroModule)
        },
        {
            path: 'caja',
            loadChildren: () => import('./cajas/cajas.module').then(m => m.CajasModule)
        },
        {
            path: 'apertura-caja',
            loadChildren: () => import('./apertura-caja/apertura-caja.module').then(m => m.AperturaCajaModule)
        },
        {
            path: 'cierre-caja',
            loadChildren: () => import('./cierre-caja/cierre-caja.module').then(m => m.CierreCajaModule)
        },
        {
            path: 'cierre-general',
            loadChildren: () => import('./cierre-general/cierre-general.module').then(m => m.CierreGeneralModule)
        },
        {
            path: 'convenio',
            loadChildren: () => import('./convenio/convenio.module').then(m => m.ConvenioModule)
        },
        {
            path: 'garantia',
            loadChildren: () => import('./garantia/garantia.module').then(m => m.GarantiaModule)
        },
        {
            path: 'nota-credito',
            loadChildren: () => import('./nota-credito/nota-credito.module').then(m => m.NotaCreditoModule)
        },
        {
            path: 'anticipo-precobrado',
            loadChildren: () => import('./anticipo-precobrado/anticipo-precobrado.module').then(m => m.AnticipoPrecobradoModule)
        },
        {
            path: 'reporte',
            loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule)
        },
        {
            path: 'gestion-movimiento-bancario',
            loadChildren: ()=>import('./gestion-movimiento-bancario/gestion-movimiento-bancario.module').then(m=>m.GestionMovimientoBancarioModule)
        },
        {
            path: 'gestion-garantia',
            loadChildren: ()=>import('./gestion-garantia/gestion-garantia.module').then(m => m.GestionGarantiaModule)
        },
        {
            path: 'configuracion-contable',
            loadChildren: ()=>import('./configuracion-contable/configuracion-contable.module').then(m=>m.ConfiguracionContableModule)
        },
        {
            path:'especies-fiscales',
            loadChildren: ()=>import('./especies-fiscales/especies-fiscales.module').then(m=>m.EspeciesFiscalesModule)
        },
        {
            path: 'recaudacion-especies',
            loadChildren: ()=>import('./recaudaciones-especies-fiscales/recaudaciones-especies-fiscales.module').then(m=>m.RecaudacionesEspeciesFiscalesModule)
        },
        {
            path: 'costas',
            loadChildren: () => import('./costas/costas.module').then(m => m.CostasModule)
        },
        {
            path: 'reportes-graficos',
            loadChildren: () => import('./reportes-graficos/reportes-graficos.module').then(m => m.ReportesGraficosModule)
        },
        {
            path: 'consulta-cobros',
            loadChildren: () => import('./consulta-cobros/consulta-cobros.module').then(m => m.ConsultaCobrosModule)
        }

    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecaudacionRoutingModule { }
