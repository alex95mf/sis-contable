import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbogadosComponent } from './abogados.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'abogados'
    },
    children: [
        {
            path: '',
            component: AbogadosComponent,
        },
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbogadosRoutingModule { }
