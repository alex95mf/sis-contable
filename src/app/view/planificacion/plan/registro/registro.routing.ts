import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistroComponent } from './registro.component';

export const routes: Routes = [{
    path: '',
    data: {
        title: 'asignacion'
    },
    children: [
        {
            path: '',
            component: RegistroComponent,
        }]
}]

@NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })

export class RegistroRoutingModule { }