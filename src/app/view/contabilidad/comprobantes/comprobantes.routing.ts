import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'contabilidad/comprobante'
        },
        children: [
            {
                path: 'asiento',
                loadChildren: () => import('./diario/diario.module').then(m => m.DiarioModule)
            },
            {
                path: 'comegreso',
                loadChildren: () => import('./egreso/egreso.module').then(m => m.EgresoModule)
            },
            {
                path: 'comingreso',
                loadChildren: () => import('./ingreso/ingreso.module').then(m => m.IngresoComprobantesModule)
            },
            {
                path: 'facturas',
                loadChildren: () => import('./facturas/facturas.module').then(m => m.FacturasModule)
            },
            {
                path: 'multas',
                loadChildren: () => import('./multas/multas.module').then(m => m.MultasModule)
            },
            {
                path: 'consulta-documentos',
                loadChildren: () => import('./consulta-documentos/consulta-documentos.module').then(m => m.ConsultaDocumentosModule)
            },
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobantesRoutingModule {}