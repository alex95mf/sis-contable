import { NgModule } from '@angular/core';
import { EstadoResultadoComponent } from './estado-resultado_old.component';
import {EstadoResultadoRoutingModule} from './estado-resultado.routing';
import { ExcelService } from '../../../../services/excel.service';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  declarations: [EstadoResultadoComponent],
  imports: [
    EstadoResultadoRoutingModule,
    AppCustomModule
  ],providers: [
    ExcelService
  ]
})
export class EstadoResultadoModule { }
