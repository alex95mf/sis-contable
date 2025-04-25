import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionComponent } from './liquidacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'liquidacion'
    },
    children: [
        {
            path: '',
            component: LiquidacionComponent,
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
export class LiquidacionRoutingModule { }
