import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ContabilidadComponent } from './contabilidad.component';
import { ContabilidadRoutingModule } from './contabilidad.routing';
import { NgxPrintModule } from 'ngx-print';



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ContabilidadRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    NgxPrintModule
  ],
  declarations: [ContabilidadComponent]
})

export class ContabilidadModule { }
