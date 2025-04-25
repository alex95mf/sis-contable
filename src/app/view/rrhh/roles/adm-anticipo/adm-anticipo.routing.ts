import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';  
import { AdmAnticipoComponent } from './adm-anticipo.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'adm-anticipo'
        },
        children: [
            {
                path: '',
                component: AdmAnticipoComponent,
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
export class AdmAnticipoRoutingModule { }
