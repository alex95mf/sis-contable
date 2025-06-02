import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {GlobalTableComponent} from '../../commons/modals/global-table/global-table.component';
import { ModalGlobalTableComponent } from './modal-global-table/modal-global-table.component';
import { AnexosDocComponent } from './anexos-doc/anexos-doc.component'
import { ReactiveFormsModule } from '@angular/forms';
import { AppCustomModule } from '../../../config/custom/app-custom.module';
@NgModule({
  declarations: [GlobalTableComponent, AnexosDocComponent, ModalGlobalTableComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    NgxExtendedPdfViewerModule,
    NgxDocViewerModule,
    NgbModule,
    ButtonsModule,
    BsDropdownModule,
    ChartsModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    AppCustomModule
  ],

})
export class CommonModalModule { }
