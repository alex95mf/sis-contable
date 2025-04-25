import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCurrencyModule } from "ngx-currency";

import { PrestamosNewRoutingModule } from './prestamos-new.routing';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { PrestamosNewComponent } from './prestamos-new.component';
import { ModalBuscaPrestamoComponent } from './modal-busca-prestamo/modal-busca-prestamo.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalConsultaPrestamosComponent } from './modal-consulta-prestamos/modal-consulta-prestamos.component';


@NgModule({
  declarations: [
    PrestamosNewComponent,
    ModalBuscaPrestamoComponent,
    ModalConsultaPrestamosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    MatTabsModule,
    PrestamosNewRoutingModule
  ],
  providers: [
    DialogService,
    ExcelService,
  ]
})
export class PrestamosNewModule { }
