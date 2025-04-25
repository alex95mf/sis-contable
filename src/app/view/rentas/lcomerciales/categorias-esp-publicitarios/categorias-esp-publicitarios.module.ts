import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasEspPublicitariosRoutingModule } from './categorias-esp-publicitarios-routing.module';
import { CategoriasEspPublicitariosComponent } from './categorias-esp-publicitarios.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormCategoriasEspacioPublicitarioComponent } from './form-categorias-espacio-publicitario/form-categorias-espacio-publicitario.component';


@NgModule({
  declarations: [
    CategoriasEspPublicitariosComponent,
    FormCategoriasEspacioPublicitarioComponent
  ],
  imports: [
    CommonModule,
    CategoriasEspPublicitariosRoutingModule,
    AppCustomModule
  ]
})
export class CategoriasEspPublicitariosModule { }
