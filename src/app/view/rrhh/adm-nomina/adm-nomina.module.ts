import { NgModule } from '@angular/core';
import { AdmNominaRoutingModule } from './adm-nomina.routing';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AppCustomModule } from '../../../config/custom/app-custom.module';
//import { FaltasPermisosComponent } from './faltas-permisos/faltas-permisos.component';
import { ExcelService } from 'src/app/services/excel.service';




@NgModule({
  declarations: [
    //FaltasPermisosComponent
  ],
  providers: [
    ExcelService
  ],
  imports: [
    AppCustomModule,
    AdmNominaRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ]
})
export class AdmNominaModule { }
