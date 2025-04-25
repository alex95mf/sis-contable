import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionIdpNominaComponent } from './generacion-idp-nomina.component'; 

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Generación de IDP Nomina'
    },
    children: [
        {
            path: '',
            component: GeneracionIdpNominaComponent,
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
export class GeneracionIdpNominaRoutingModule { }
