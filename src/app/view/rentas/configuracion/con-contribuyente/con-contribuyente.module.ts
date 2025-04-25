import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConContribuyenteRoutingModule } from './con-contribuyente-routing.module';
import { ConContribuyenteComponent } from './con-contribuyente.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';


@NgModule({
  declarations: [
    ConContribuyenteComponent
  ],
  imports: [
    CommonModule,
    ConContribuyenteRoutingModule,
    AppCustomModule
  ],
  providers: [
    ExcelService,
  ]
})
export class ConContribuyenteModule { }
