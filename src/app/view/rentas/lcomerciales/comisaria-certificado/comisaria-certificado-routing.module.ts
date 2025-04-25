import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComisariaCertificadoComponent } from './comisaria-certificado.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'comisaria-certificado'
    },
    children: [
        {
            path: '',
            component: ComisariaCertificadoComponent,
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
export class ComisariaCertificadoRoutingModule { }
