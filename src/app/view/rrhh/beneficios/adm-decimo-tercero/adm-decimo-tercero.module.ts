import { NgModule } from '@angular/core';
import { AdmDecimoTerceroRoutingModule } from './adm-decimo-tercero.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { AdmDecimoTerceroComponent } from './adm-decimo-tercero.component';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';

@NgModule({
  declarations: [AdmDecimoTerceroComponent,ModalProgramaComponent],
  imports: [
    AppCustomModule,
    AdmDecimoTerceroRoutingModule,
    CalendarModule,
    TableModule,
    CheckboxModule
  ]
})
export class AdmDecimoTerceroModule { }
