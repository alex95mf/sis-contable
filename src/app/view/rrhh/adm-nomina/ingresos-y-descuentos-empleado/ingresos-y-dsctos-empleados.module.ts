import { NgModule } from '@angular/core';
import { IngresosYDescuentosEmpleadoComponent } from './ingresos-y-descuentos-empleado.component';
import { IngresosYDsctosEmpleadoRoutingModule } from './ingresos-y-dsctos-empleados.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';
 



@NgModule({
  declarations: [IngresosYDescuentosEmpleadoComponent,ModalProgramaComponent ],
  imports: [
    IngresosYDsctosEmpleadoRoutingModule,
    AppCustomModule,
    CalendarModule,
    TableModule,
    MessagesModule,
    MessageModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
  ],
  providers: [
    ExcelService
  ]
 
})
export class RhIngresosDsctosEmpleadoModule { }


