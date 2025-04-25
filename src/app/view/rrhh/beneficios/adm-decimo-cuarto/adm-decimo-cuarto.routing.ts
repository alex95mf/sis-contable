import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmDecimoCuartoComponent } from './adm-decimo-cuarto.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'adm-decimo-cuarto'
        },
        children: [
            {
                path: '',
                component: AdmDecimoCuartoComponent,
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
export class AdmDecimoCuartoRoutingModule { }
