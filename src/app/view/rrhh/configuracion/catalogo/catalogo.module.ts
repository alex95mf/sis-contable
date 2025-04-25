import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoRoutingModule } from './catalogo.routing';
import { CatalogoComponent } from './catalogo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';


@NgModule({
  declarations: [
    CatalogoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CatalogoRoutingModule
  ]
})
export class CatalogoModule { }
