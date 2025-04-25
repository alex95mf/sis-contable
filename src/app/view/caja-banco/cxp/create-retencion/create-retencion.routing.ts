import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRetencionComponent } from './create-retencion.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'create-retencion'
        },
        children: [
            {
                path: '',
                component: CreateRetencionComponent,
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
export class CreateRetencionCompraRoutingModule { }