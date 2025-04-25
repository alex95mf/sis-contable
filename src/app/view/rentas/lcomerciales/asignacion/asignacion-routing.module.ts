import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionComponent } from './asignacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'asignacion de inspecciones'
    },
    children: [
        {
            path: '',
            component: AsignacionComponent,
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
export class AsignacionRoutingModule { }
