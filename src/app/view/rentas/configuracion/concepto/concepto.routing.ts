import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConceptoComponent } from './concepto.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'concepto'
        },
        children: [
            {
                path: '',
                component: ConceptoComponent,
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
export class ConceptoRoutingModule { }