import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosOnlineComponent } from './usuarios-online.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'g-wallet'
        },
        children: [
            {
                path: '',
                component: UsuariosOnlineComponent,
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
export class UserOnlineRoutingModule { }