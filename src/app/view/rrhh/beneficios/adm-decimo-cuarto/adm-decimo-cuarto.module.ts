import { NgModule } from '@angular/core';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { AdmDecimoCuartoComponent } from './adm-decimo-cuarto.component';
import { AdmDecimoCuartoRoutingModule } from './adm-decimo-cuarto.routing';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';


@NgModule({
  declarations: [AdmDecimoCuartoComponent,ModalProgramaComponent],
  imports: [
    AppCustomModule,
    AdmDecimoCuartoRoutingModule,
    CalendarModule,
    TableModule
  ]
})
export class AdmDecimoCuartoModule { }
