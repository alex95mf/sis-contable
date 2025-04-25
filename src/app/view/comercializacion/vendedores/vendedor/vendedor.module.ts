import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorRoutingModule } from './vendedor.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { VendedorComponent } from './vendedor.component';
import { ContactosVendedorComponent } from './contactos/contactos.component';
import { ShowVendedorComponent } from './show-vendedor/show-vendedor.component';
import { ModalProductComponent } from "./modal-product/modal-product.component";

@NgModule({
  declarations: [VendedorComponent,ContactosVendedorComponent,ShowVendedorComponent,ModalProductComponent],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgxPrintModule,
    MultiSelectModule,
    NgxDocViewerModule,
    DatePickerModule,
    AppCustomModule
  ],
  entryComponents: [
    
  ]
})

export class VendedorModule { }
