import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneracionCompraTerrenoComponent } from './generacion-compra-terreno.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'generacion-compra-terreno'
    },
    children: [
      {
        path: '',
        component: GeneracionCompraTerrenoComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneracionCompraTerrenoRoutingModule { }
