import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaDocumentosComponent } from './consulta-documentos.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'consulta-documentos'
    },
    children: [
        {
            path: '',
            component: ConsultaDocumentosComponent,
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
export class ConsultaDocumentosRoutingModule { }
