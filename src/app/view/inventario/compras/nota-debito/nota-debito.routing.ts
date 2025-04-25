import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotaDebitoComponent } from './nota-debito.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'notadebito'
        },
        children: [
            {
                path: '',
                component: NotaDebitoComponent,
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
export class NotaDebitoRoutingModule { }