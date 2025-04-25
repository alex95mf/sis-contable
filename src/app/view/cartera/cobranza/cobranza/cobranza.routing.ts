import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CobranzaComponent } from './cobranza.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'monitor/cobranza'
        },
        children: [
            {
                path: '',
                component: CobranzaComponent,
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
export class CobranzaRoutingModule { }