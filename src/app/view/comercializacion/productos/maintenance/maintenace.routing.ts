import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'maintenance'
        },
        children: [
            {
                path: '',
                component: MaintenanceComponent,
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
export class MaintenaicenRoutingModule { }