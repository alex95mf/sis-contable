import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'presupuesto'
    },
    children: [
        {
            path: 'configuracion',
            loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule)
        },
        {
          path: 'movimiento',
          loadChildren: ()=>import('./movimiento/movimiento.module').then(m=>m.MovimientoModule)
        },
        
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresupuestoRoutingModule { }
