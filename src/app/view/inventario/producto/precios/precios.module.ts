import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreciosComponent} from './precios.component';
import {PreciosRoutingModule} from './precios.routing';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  declarations: [PreciosComponent],
  imports: [
    CommonModule,
    PreciosRoutingModule,
    FormsModule,
    DataTablesModule,
    MultiSelectModule,
    AppCustomModule,
    DropDownTreeModule
  ]
})
export class PreciosModule { }
