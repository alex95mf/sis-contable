import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChequesPostComponent } from './cheques-post.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'chequespost'
        },
        children: [
            {
                path: '',
                component: ChequesPostComponent,
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
export class ChequesPostRoutingModule { }