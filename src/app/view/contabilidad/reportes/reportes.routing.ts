import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'reportes'
        },
        children: [
            {
                path: 'sumasaldos',
                //loadChildren: () => import('./balancecomprobacion/balancecomprobacion.module').then(m => m.BalancecomprobacionModule)
                loadChildren: () => import('./sumasysaldos/sumasysaldos.module').then(m => m.SumasySaldosModule)

            },
            {
                path: 'movimientos',
                loadChildren: () => import('./mov-contable/mov-contable.module').then(m => m.MovContableModule)
            },
            {
                path: 'movimientos/:fecha_desde/:fecha_hasta/:codigo_cuenta',
                loadChildren: () => import('./mov-contable/mov-contable.module').then(m => m.MovContableModule)
            },
            {
                path: 'estado-cuenta-pro',
                loadChildren: ()=>import('./estado-cuenta-proveedor/estado-cuenta-proveedor.module').then(m=>m.EstadoCuentaProveedorModule)
            },
            
            {
                path: 'cartera-proveedores',
                loadChildren: () => import('./cartera-proveedores/cartera-proveedores.module').then(m => m.CarteraProveedoresModule)
            },
            {
                path: 'diariogeneral',
                loadChildren: () => import('./diariogeneral/diariogeneral.module').then(m => m.DiarioGeneralModule)
            },

            {
                path: 'retenciones_generadas',
                loadChildren: () => import('./retenciones-generadas/retenciones-generadas.module').then(m => m.RetencionesGeneradasModule)
            },
            {
                path: 'reporte_ice',
                loadChildren: () => import('./reportes-ice/reportes-ice.module').then(m => m.ReportesIceModule)
            },
            {
                path: 'reporte-esigef',
                loadChildren: () => import('./reporte-esigef/reporte-esigef.module').then(m => m.ReporteEsigefModule)
            },
            {
                path: 'ats',
                loadChildren: () => import('./ats/ats.module').then(m => m.AtsModule)
            },
            {
                path: 'compras_dinamico',
                loadChildren: () => import('./rpd-compras-dinamico/rpd-compras-dinamico.module').then(m => m.RpdComprasDinamicoModule)
            },
            {
                path: 'documentos-electronicos',
                loadChildren: () => import('./doc-elec/doc-elec.module').then(m => m.DocElecModule)
            },
            {
                path: 'flujo-efectivo',
                loadChildren: () => import('./flujo-efectivo/flujo-efectivo.module').then(m => m.FlujoEfectivoModule)
            },
            {
                path: 'formulario-ciento-tres',
                loadChildren: () => import('./formulario-ciento-tres/formulario-ciento-tres.module').then(m => m.FormularioCientoTresModule)
            },

        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule {}