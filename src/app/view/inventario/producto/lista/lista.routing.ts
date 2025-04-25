import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'lista'
        },
        children: [
            {
                path: '',
                component: ListaComponent,
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
export class ListaRoutingModule { }