import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaProveedoesRoutingModule } from './consulta-proveedores-routing.module'; 
import { ConsultaProveedoresComponent } from './consulta-proveedores.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ConsultaProveedoresComponent
  ],
  imports: [
    CommonModule,
    ConsultaProveedoesRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService,
  ]
})
export class ConsultaProveedoresModule { }
