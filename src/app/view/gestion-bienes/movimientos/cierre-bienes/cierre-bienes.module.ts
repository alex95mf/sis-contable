import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreBienesRoutingModule } from './cierre-bienes.routing';
import { CierreBienesComponent } from './cierre-bienes.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { TableModule } from 'primeng/table';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';


@NgModule({
  declarations: [
    CierreBienesComponent,
    ModalBusquedaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    TableModule,
    CierreBienesRoutingModule
  ]
})
export class CierreBienesModule { }
