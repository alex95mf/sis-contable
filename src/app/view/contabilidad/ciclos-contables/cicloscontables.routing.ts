import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { PeriodosContablesComponent } from './periodos-contables.component';


export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'contabilidad/cicloscontables'
        },
        children: [

           {
            path: 'cierredemes',
            loadChildren: () => import ('./cierre-de-mes/cierre-de-mes.module').then(m => m.CierreDeMesModule)
           },
        //     {
        //     path: 'cierredeanio',
        //     loadChildren: () => import ('./cierre-de-anio/cierre-de-anio.module').then(m => m.CierreAnioModule)
        //    },
        //    {
        //    path: 'cierredesaldos',
        //    loadChildren: () => import ('./cierre-saldos/cierre-saldos.module').then(m => m.CierreSaldosModule)
        //    },
        //    {
        //     path: 'cierredeimpuestos',
        //     loadChildren: () => import ('./cierre-de-impuestos/cierre-de-impuestos.module').then(m => m.CierreDeImpuestosModule)
        //    }
        {
            path: 'cierre-anticipos-proveedores',
            loadChildren: () => import('./cierre-anticipos-proveedores/cierre-anticipos-proveedores.module').then(m => m.CierreAnticiposProveedoresModule)
        },
        {
            path: 'cierre-cxc',
            loadChildren: () => import('./cierre-cxc/cierre-cxc.module').then(m => m.CierreCxcModule)
        },
        {
            path: 'cierre-superavit',
            loadChildren: () => import('./cierre-superavit/cierre-superavit.module').then(m => m.CierreSuperavitModule)
        },
        ]
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CiclosContablesRoutingModule { }

