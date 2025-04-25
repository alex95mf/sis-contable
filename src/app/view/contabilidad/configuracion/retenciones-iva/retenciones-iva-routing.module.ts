import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetencionesIvaComponent } from './retenciones-iva.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'retencion iva'
    },
    children: [
        {
            path: '',
            component: RetencionesIvaComponent,
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
export class RetencionesIvaRoutingModule { }
