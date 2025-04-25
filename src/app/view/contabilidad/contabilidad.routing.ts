import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'contabilidad'
        },
        children: [
            {
                path: 'plancuenta',
                loadChildren: () => import('./plan-cuentas/plan-cuentas.module').then(m => m.PlanCuentasModule)
            },
            {
                path: 'plancuentatree',
                loadChildren: () => import('./plan-cuentas-tree/plan-cuentas-tree.module').then(m => m.PlanCuentasTreeModule)
            },
            {
                path: 'comprobante',
                loadChildren: () => import('./comprobantes/comprobantes.module').then(m => m.ComprobantesModule)
            },
            {
                path: 'reportes',
                loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
            },
            {
                path: 'estadofinanciero',
                loadChildren: () => import('./estados-financieros/estados-financieros.module').then(m => m.EstadosFinancierosModule)
            },
            {
                path: 'activofijo',
                loadChildren: () => import('./activo-fijo/activo-fijo.module').then(m => m.ActivoFijoModule)
            },
            {
                path: 'centrocosto',
                loadChildren: () => import('./centro-costo/centro-costo.module').then(m => m.CentroCostoModule)
            },
            {
                path: 'generacionderetencion',
                loadChildren: () => import('./generacion-de-retencion/pro_generacion_de_retencion.module').then(m => m.GeneracionRetencionModule)
            },
            {
                path: 'cicloscontables',
                loadChildren: () => import('./ciclos-contables/cicloscontables.module').then(m => m.CiclosContablesModule)
            },
            {
                path: 'catalogo-presupuesto',
                loadChildren: ()=>import('./catalogo-presupuesto/catalogo-presupuesto.module').then(m=>m.CatalogoPresupuestoModule)
            },
            {
                path: 'reglas',
                loadChildren: ()=>import('./reglas/generacion/generacion.module').then(m=>m.GeneracionModule)
            },
            {
                path: 'revision-cierre',
                loadChildren: ()=>import('./revision-cierre/revision-cierre.module').then(m=>m.RevisionCierreModule)
            },
            {
                path: 'auxiliares',
                loadChildren: () => import('./auxiliares/auxiliares.module').then(m => m.AuxiliaresModule)
            },
            {
                path: 'cierre-cxp',
                loadChildren: () => import('./facturas-saldo/facturas-saldo.module').then(m => m.FacturasSaldoModule)
            },
            {
                path: 'configuracion',
                loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
            },
            {
                path: 'regla-presupuestaria',
                loadChildren: () => import('./regla-presupuestaria/regla-presupuestaria.module').then(m => m.ReglaPresupuestariaModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContabilidadRoutingModule { }