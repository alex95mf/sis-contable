import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedoresComponent } from './proveedores.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { ModalProveedoresComponent } from './modal-proveedores/modal-proveedores.component';


@NgModule({
  declarations: [
    ProveedoresComponent,
    AnexosListComponentDis,
    ModalProveedoresComponent
  ],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,
    AppCustomModule
  ]
})
export class ProveedoresModule { }
