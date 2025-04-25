import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KardexComponent } from './kardex.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'kardex'
        },
        children: [
            {
                path: '',
                component: KardexComponent,
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
export class KardexRoutingModule { }