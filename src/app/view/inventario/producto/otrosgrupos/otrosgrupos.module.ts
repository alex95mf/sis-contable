import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ModalGroupComponent } from '../consulta/modal-group/modal-group.component';
import { NgxPrintModule } from 'ngx-print';
import { AutofocusDirective } from '../consulta/auto-focus.directive';
import { AnexosComponent } from '../../../commons/modals/anexos/anexos.component'
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { OtrosGruposRoutingModule } from './otrosgrupos.routing';
import { OtrosgruposComponent } from './otrosgrupos.component'

@NgModule({
    imports: [
      NgxPrintModule,
      FormsModule,
      CommonModule,
      OtrosGruposRoutingModule,
      ChartsModule,
      BsDropdownModule,
      NgbModule,
      ButtonsModule.forRoot(),
      TreeViewModule,
      NgxDocViewerModule,
      AppCustomModule
    ],
    declarations: [
        OtrosgruposComponent, ModalGroupComponent, AutofocusDirective, AnexosComponent],
  })
export class OtrosGruposModule { }
