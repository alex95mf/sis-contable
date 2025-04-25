import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtrosgruposComponent } from './otrosgrupos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'minmax'
        },
        children: [
            {
                path: '',
                component: OtrosgruposComponent,
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

export class OtrosGruposRoutingModule { }