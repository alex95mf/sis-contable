import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteraProveedoresComponent } from './cartera-proveedores.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'cartera-proveedores'
    },
    children: [
        {
            path: '',
            component: CarteraProveedoresComponent,
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
export class CarteraProveedoresRoutingModule { }
