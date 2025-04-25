import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionIngresosComponent } from './asignacion-ingresos.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Asignacion inicial de ingresos'
    },
    children: [
        {
            path: '',
            component: AsignacionIngresosComponent,
            data: {
                title: ''
            }
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionIngresosRoutingModule { }
