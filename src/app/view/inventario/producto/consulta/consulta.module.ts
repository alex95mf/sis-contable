import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ConsultaComponent } from './consulta.component';
import { ConsultaRoutingModule } from './consulta.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ModalGroupComponent } from './modal-group/modal-group.component';
import { NgxPrintModule } from 'ngx-print';
import { AutofocusDirective } from './auto-focus.directive'
import { AnexosComponent } from '../../../commons/modals/anexos/anexos.component'
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    NgxPrintModule,
    FormsModule,
    CommonModule,
    ConsultaRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgbModule,
    ButtonsModule.forRoot(),
    TreeViewModule,
    NgxDocViewerModule,
    AppCustomModule
  ],
  declarations: [
    ConsultaComponent, ModalGroupComponent, AutofocusDirective, AnexosComponent],
})
export class ConsultaProductoModule { }
