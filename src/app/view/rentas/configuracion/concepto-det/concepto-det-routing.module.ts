import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptoDetComponent } from './concepto-det.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'concepto detalle'
    },
    children: [
        {
            path: '',
            component: ConceptoDetComponent,
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
export class ConceptoDetRoutingModule { }
