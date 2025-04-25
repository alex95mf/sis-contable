import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { CargaFamiliarComponent } from './carga-familiar.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'carga-familiar'
        },
        children: [
            {
                path: '',
                component: CargaFamiliarComponent,
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

export class CargaFamiliarRoutingModule { }