import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersRegisterComponent } from './customers-register.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'register'
        },
        children: [
            {
                path: '',
                component: CustomersRegisterComponent,
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
export class CustomerRegisterRoutingModule { }