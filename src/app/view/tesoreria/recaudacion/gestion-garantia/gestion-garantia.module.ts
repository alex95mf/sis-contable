import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionGarantiaRoutingModule } from './gestion-garantia-routing.module';
import { GestionGarantiaComponent } from './gestion-garantia.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';
import { DetallesGestionGarantiaComponent } from './detalles-gestion-garantia/detalles-gestion-garantia.component';


@NgModule({
  providers: [
    ExcelService
  ],
  declarations: [
    GestionGarantiaComponent,
    DetallesGestionGarantiaComponent
  ],
  imports: [
    CommonModule,
    GestionGarantiaRoutingModule,
    AppCustomModule
  ]
})
export class GestionGarantiaModule { }
