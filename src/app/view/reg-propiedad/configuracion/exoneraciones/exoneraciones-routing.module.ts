import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExoneracionesComponent } from './exoneraciones.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'exoneraciones'
    },
    children: [
        {
            path: '',
            component: ExoneracionesComponent,
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
export class ExoneracionesRoutingModule { }
