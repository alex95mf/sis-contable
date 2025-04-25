import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionIcpComponent } from './generacion-icp.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Generación de ICP'
    },
    children: [
        {
            path: '',
            component: GeneracionIcpComponent,
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
export class GeneracionIcpRoutingModule { }
