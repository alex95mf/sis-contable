import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresarialComponent } from './empresarial.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'sistemas/parametros'
        },
        children: [
            {
                path: '',
                component: EmpresarialComponent,
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

export class EmpresarialRoutingModule { }