import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'comercializacion/facturacion'
        },
        children: [
            {
                path: 'cotizaciones',
                loadChildren: () => import('./quotes/quotes.module').then(m => m.QuotesModule)
            },
            {
                path: 'puntov',
                loadChildren: () => import('./point-sales/point-sales.module').then(m => m.PointSalesModule)
            },
            {
                path: 'ffisica',
                loadChildren: () => import('./invoice-sales/invoice-sales.module').then(m => m.InvoiceSalesModule)
            },
            {
                path: 'felectronica',
                loadChildren: () => import('./fac-electronica/fac-electronica.module').then(m => m.FacElectronicaModule)
            },
            {
                path: 'retenciones',
                loadChildren: () => import('./retencion-venta/retencion-venta.module').then(m => m.RetencionVentaModule)
            },
            {
                path: 'reportes',
                loadChildren: () => import('./reports-invoice/reports-invoice.module').then(m => m.ReportsInvoiceModule)
            },
            {
                path: 'aprobaciones',
                loadChildren: () => import('./reports/reports.module').then(m => m.ReportsVentasModule)
            },
            {
                path: 'mantenimiento',
                loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule)
            },
            {
                path: 'reportesquote',
                loadChildren: () => import('./report-quotes/report-quotes.module').then(m => m.ReportQuotesModule)
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacturacionRoutingModule { }