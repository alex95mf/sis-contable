import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptosComponent } from './conceptos.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'conceptos'
        },
        children: [
            {
                path: '',
                component: ConceptosComponent,
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
export class ConceptosRoutingModule { }
