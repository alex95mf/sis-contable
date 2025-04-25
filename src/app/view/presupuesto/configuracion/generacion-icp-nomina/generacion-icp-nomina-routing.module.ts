import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionIcpNominaComponent } from './generacion-icp-nomina.component'; 

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Generación de ICP Nómina'
    },
    children: [
        {
            path: '',
            component: GeneracionIcpNominaComponent,
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
export class GeneracionIcpNominaRoutingModule { }
