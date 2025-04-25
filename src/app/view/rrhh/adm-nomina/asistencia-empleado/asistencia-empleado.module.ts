import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsistenciaEmpleadoRoutingModule } from './asistencia-empleado-routing.module';
import { AsistenciaEmpleadoComponent } from './asistencia-empleado.component'; 
import { AppCustomModule } from 'src/app/config/custom/app-custom.module'; 

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';
import { ImportarComponent } from './importar/importar.component';
import { AtrasosComponent } from './atrasos/atrasos.component';
import { BiometricosComponent } from './biometricos/biometricos.component';


@NgModule({
  declarations: [
     AsistenciaEmpleadoComponent,
     ImportarComponent,
     AtrasosComponent,
     BiometricosComponent
  ],
  imports: [
    CommonModule,
    AsistenciaEmpleadoRoutingModule,
    AppCustomModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    MatDialogModule,
    ToastModule
  ]
})
export class AsistenciaEmpleadoModule { }
