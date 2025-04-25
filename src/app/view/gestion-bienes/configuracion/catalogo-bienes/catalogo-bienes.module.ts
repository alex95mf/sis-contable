import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoBienesRoutingModule } from './catalogo-bienes-routing.module';
import { CatalogoBienesComponent } from './catalogo-bienes.component';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalCreateComponent } from './modal-create/modal-create.component';


@NgModule({
  declarations: [
    CatalogoBienesComponent,
    ModalEditionComponent,
    ModalCreateComponent
  ],
  imports: [
    CommonModule,
    CatalogoBienesRoutingModule,
    AppCustomModule
  ]
})
export class CatalogoBienesModule { }
