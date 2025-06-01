import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrosNominaRoutingModule } from './parametros-nomina-routing.module';
import { ParametrosNominaComponent } from './parametros-nomina.component';
import { ParametroFormComponent } from './parametro-form/parametro-form.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';



@NgModule({
  declarations: [
    ParametrosNominaComponent,
    ParametroFormComponent,
  ],
  imports: [
    CommonModule,
    ParametrosNominaRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class ParametrosNominaModule { }
