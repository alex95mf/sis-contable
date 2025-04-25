import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoComponent } from './empleado.component';
import { EmpleadoRoutingModule } from './empleado.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {ToastModule} from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ModelFamiliarComponent } from './model-familiar/model-familiar.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ModalTipoArchivoComponent } from './modal-tipo-archivo/modal-tipo-archivo.component';
import { ModalRetencionJudicialComponent } from './modal-retencion-judicial/modal-retencion-judicial.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [EmpleadoComponent, ModelFamiliarComponent, ModalTipoArchivoComponent, ModalRetencionJudicialComponent],
  imports: [
    AppCustomModule,
    EmpleadoRoutingModule,
    CalendarModule,
    TableModule,
    SkeletonModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    ButtonModule,
    NgxCurrencyModule,
    CheckboxModule
  ],
})
export class EmpleadoModule { }
