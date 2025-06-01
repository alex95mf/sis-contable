import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroPolizaRoutingModule } from './registro-poliza-routing.module';
import { RegistroPolizaComponent } from './registro-poliza.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListBusquedaComponent } from './list-busqueda/list-busqueda.component';
import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    RegistroPolizaComponent,
    ListBusquedaComponent,
    AnexosListComponent
  ],
  imports: [
    CommonModule,
    RegistroPolizaRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class RegistroPolizaModule { }
