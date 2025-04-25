import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BancariasComponent } from './bancarias.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'bancaria'
        },
        children: [
            {
                path: '',
                component: BancariasComponent,
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
export class BancariaRoutingModule { }