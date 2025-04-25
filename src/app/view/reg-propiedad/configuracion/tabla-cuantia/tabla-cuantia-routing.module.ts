import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaCuantiaComponent } from './tabla-cuantia.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'tabla de cuantia'
    },
    children: [
        {
            path: '',
            component: TablaCuantiaComponent,
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
export class TablaCuantiaRoutingModule { }
