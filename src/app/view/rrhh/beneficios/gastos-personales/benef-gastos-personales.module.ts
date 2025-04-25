import { NgModule } from '@angular/core';
import { GastosPersonalesComponent } from './gastos-personales.component';
import { GastosPersonalesRoutingModule } from './benef-gastos-personales.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { ViewMasivoComponent } from './view-masivo/view-masivo.component';
import { EmpleadosComponent } from './empleados/empleados.component';

@NgModule({
  declarations: [GastosPersonalesComponent, ViewMasivoComponent,EmpleadosComponent ],
  imports: [
    AppCustomModule,
    NgxCurrencyModule,
    GastosPersonalesRoutingModule
  ],
  providers: [
    ExcelService,
  ]
 
})
export class GastosPersonalesModule { }


