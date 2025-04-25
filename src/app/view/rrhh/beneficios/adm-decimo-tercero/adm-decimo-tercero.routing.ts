import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmDecimoTerceroComponent } from './adm-decimo-tercero.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'adm-decimo-tercero'
        },
        children: [
            {
                path: '',
                component: AdmDecimoTerceroComponent,
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
export class AdmDecimoTerceroRoutingModule { }
