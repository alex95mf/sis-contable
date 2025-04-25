import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPreciosComponent } from './lista-precios.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'lista Precios'
    },
    children: [
      {
        path: '',
        component: ListaPreciosComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaPreciosRoutingModule
{ }
