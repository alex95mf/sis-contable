import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetencionesFuenteComponent } from './retenciones-fuente.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'retencion fuente'
    },
    children: [
        {
            path: '',
            component: RetencionesFuenteComponent,
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
export class RetencionesFuenteRoutingModule { }
