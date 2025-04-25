import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaDocumentosRoutingModule } from './consulta-documentos-routing.module';
import { ConsultaDocumentosComponent } from './consulta-documentos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { DetallesGestionGarantiaComponent } from './detalles-gestion-garantia/detalles-gestion-garantia.component';
import { ExcelService } from 'src/app/services/excel.service';

@NgModule({
  declarations: [
    ConsultaDocumentosComponent,
    DetallesGestionGarantiaComponent
  ],
  imports: [
    CommonModule,
    ConsultaDocumentosRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService
  ]
})
export class ConsultaDocumentosModule { }
