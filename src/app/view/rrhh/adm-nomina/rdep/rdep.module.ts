import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RdepRoutingModule } from './rdep-routing.module';
import { RdepComponent } from './rdep.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module'; 

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    RdepComponent
  ],
  imports: [
    CommonModule,
    RdepRoutingModule,
    AppCustomModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    MatDialogModule,
    ToastModule
  ]
})
export class RdepModule { }
