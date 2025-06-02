import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConsultaSupplierRoutingModule} from './consulta-supplier.routing'
import {ConsultaSupplierComponent} from './consulta-supplier.component'
import {CommonModalModule} from '../../../commons/modals/modal.module'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { ShowSupplierComponent } from './show-supplier/show-supplier.component';

@NgModule({
  declarations: [ConsultaSupplierComponent, ShowSupplierComponent],
  imports: [
    CommonModule,
    ConsultaSupplierRoutingModule,
    AppCustomModule,
    CommonModalModule,
    DropDownTreeModule
  ],

})
export class ConsultaSuppliersModule { }
