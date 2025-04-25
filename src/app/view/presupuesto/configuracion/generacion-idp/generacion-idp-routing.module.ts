import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionIdpComponent } from './generacion-idp.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Generación de IDP'
    },
    children: [
        {
            path: '',
            component: GeneracionIdpComponent,
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
export class GeneracionIdpRoutingModule { }
