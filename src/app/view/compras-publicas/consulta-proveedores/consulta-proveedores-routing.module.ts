import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaProveedoresComponent } from './consulta-proveedores.component'; 

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'con-contribuyente'
      },
      children: [
          {
              path: '',
              component: ConsultaProveedoresComponent,
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
export class ConsultaProveedoesRoutingModule { }
