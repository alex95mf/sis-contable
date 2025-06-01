import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspeciesFiscalesRoutingModule } from './especies-fiscales-routing.module';
import { EspeciesFiscalesComponent } from './especies-fiscales.component';
import { ModalEspeciesFiscalesComponent } from './modal-especies-fiscales/modal-especies-fiscales.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnulacionEspeciesComponent } from './anulacion-especies/anulacion-especies.component';
import { HistorialAnulacionesComponent } from './historial-anulaciones/historial-anulaciones.component';
import { NgxCurrencyDirective } from 'ngx-currency';


@NgModule({
  declarations: [
    EspeciesFiscalesComponent,
    ModalEspeciesFiscalesComponent,
    AnulacionEspeciesComponent,
    HistorialAnulacionesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    EspeciesFiscalesRoutingModule,
  ]
})
export class EspeciesFiscalesModule { }
