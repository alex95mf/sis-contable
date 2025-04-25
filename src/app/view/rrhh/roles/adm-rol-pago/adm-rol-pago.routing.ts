import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { AdmRolPagoComponent } from './adm-rol-pago.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'adm-rol-pago'
        },
        children: [
            {
                path: '',
                component: AdmRolPagoComponent,
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
export class AdmRolPagoRoutingModule { }
