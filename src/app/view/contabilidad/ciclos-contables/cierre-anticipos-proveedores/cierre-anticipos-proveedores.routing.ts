import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreAnticiposProveedoresComponent } from './cierre-anticipos-proveedores.component';

const routes: Routes = [
  {
    path: '',
    component: CierreAnticiposProveedoresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreAnticiposProveedoresRoutingModule { }
