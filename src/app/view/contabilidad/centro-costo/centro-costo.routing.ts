import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'contabilidad/centrocosto'
        },
        children: [
            {
                path: 'mantenimiento',
                loadChildren: () => import('./cc-mantenimiento/cc-mantenimiento.module').then(m => m.CcMantenimientoModule)
            },
            {
                path: 'consulta',
                loadChildren: () => import('./nueva-consulta/nueva-consulta.module').then(m => m.NuevaConsultaModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroCostoRoutingModule { }