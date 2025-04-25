import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { CatalogoElectronicoRoutingModule } from './catalogo-electronico-routing.module';
import { CatalogoElectronicoComponent } from './catalogo-electronico.component';
import { DetalleCatalogoElectronicoComponent } from './detalle-catalogo-electronico/detalle-catalogo-electronico.component';
import { ModalOrdenCompraComponent } from './modal-orden-compra/modal-orden-compra.component';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { CalendarModule } from 'primeng/calendar';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    CatalogoElectronicoComponent,
    DetalleCatalogoElectronicoComponent,
    ModalOrdenCompraComponent,
    AnexosListComponentDis
  ],
  imports: [
    CommonModule,
    CatalogoElectronicoRoutingModule,
    AppCustomModule,
    CalendarModule,
    NgxCurrencyModule,
  ]
})
export class CatalogoElectronicoModule { }
