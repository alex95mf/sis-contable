import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreAnticiposProveedoresRoutingModule } from './cierre-anticipos-proveedores.routing';
import { CierreAnticiposProveedoresComponent } from './cierre-anticipos-proveedores.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    CierreAnticiposProveedoresComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    TableModule,
    CierreAnticiposProveedoresRoutingModule
  ]
})
export class CierreAnticiposProveedoresModule { }
