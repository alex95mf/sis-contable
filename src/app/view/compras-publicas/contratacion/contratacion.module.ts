import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ContratacionRoutingModule } from './contratacion.routing';
import { ContratacionComponent } from './contratacion.component';
import { DetalleContratacionComponent } from './detalle-contratacion/detalle-contratacion.component';
import { ModalCondicionesComponent } from './modal-condiciones/modal-condiciones.component';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { AnexosListUnoComponentDis } from './anexos-list-uno/anexos-list-uno.component';
// import { AnexosListaComponentDis } from './anexos-lista/anexos-lista-dis.component';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
@NgModule({
  declarations: [
    ContratacionComponent,
    DetalleContratacionComponent,
    ModalCondicionesComponent,
    AnexosListComponentDis,
    AnexosListUnoComponentDis
    // AnexosListaComponentDis
  ],
  providers: [
    ExcelService
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    CalendarModule,
    ContratacionRoutingModule,
    NgxCurrencyModule

  ]
})
export class ContratacionModule { }
