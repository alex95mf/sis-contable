import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinmaxComponent } from './minmax.component'
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { MinMaxRoutingModule } from './minmax.routing';

@NgModule({
  declarations: [MinmaxComponent],
  imports: [
    CommonModule,
    MinMaxRoutingModule,
    FormsModule,
    DataTablesModule,
    MultiSelectModule,
    AppCustomModule,
    DropDownTreeModule
  ]
})
export class MinMaxModule { }
