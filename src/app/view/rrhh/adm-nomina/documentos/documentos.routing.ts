import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { DocumentosComponent } from './documentos.component';

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'documentos'
        },
        children: [
            {
                path: '',
                component: DocumentosComponent,
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

export class DocumentosRoutingModule { }