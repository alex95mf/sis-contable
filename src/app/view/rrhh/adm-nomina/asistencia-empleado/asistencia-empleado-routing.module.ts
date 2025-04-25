import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaEmpleadoComponent } from './asistencia-empleado.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'asistencia-empleado'
    },
    children: [
        {
            path: '',
            component: AsistenciaEmpleadoComponent,
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
export class AsistenciaEmpleadoRoutingModule { }
