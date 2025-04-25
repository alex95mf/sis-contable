import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrosCuentasComprobantesComponent } from './parametros-cuentas-comprobantes.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'parametros cuentas comprobantes'
    },
    children: [
        {
            path: '',
            component: ParametrosCuentasComprobantesComponent,
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
export class ParametrosCuentasComprobantesRoutingModule { }
