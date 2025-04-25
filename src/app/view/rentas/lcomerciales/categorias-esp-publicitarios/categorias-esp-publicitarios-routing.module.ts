import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasEspPublicitariosComponent } from './categorias-esp-publicitarios.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'categorias-esp-publicitarios'
    },
    children: [
        {
            path: '',
            component: CategoriasEspPublicitariosComponent,
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
export class CategoriasEspPublicitariosRoutingModule { }
