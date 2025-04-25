import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubrogacionComponent } from './subrogacion.component';
import { EmpleadoRoutingModule } from './subrogacion.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import {DividerModule} from 'primeng/divider';
import { NgxCurrencyModule } from 'ngx-currency';
import { ModalConsultaSubrogacionComponent } from './modal-consulta-subrogacion/modal-consulta-subrogacion.component';



import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {ToastModule} from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [SubrogacionComponent,ModalConsultaSubrogacionComponent],
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
    DividerModule,
    NgxCurrencyModule
  ],
  providers: [
    MessageService
  ]
})
export class SubrogacionModule { }
