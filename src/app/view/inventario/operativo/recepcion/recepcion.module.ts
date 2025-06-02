import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecepcionComponent } from './recepcion.component';
import { RecepcionRoutingModule } from './recepcion.routing'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ShowRecepcionComponent } from './show-recepcion/show-recepcion.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ RecepcionComponent,ShowRecepcionComponent ],
  imports: [
    CommonModule,
    RecepcionRoutingModule,
    AppCustomModule,
    DataTablesModule
  ],
})
export class RecepcionModule { }
