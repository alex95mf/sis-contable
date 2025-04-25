import { NgModule } from '@angular/core';
import {ConciliacionComponent} from './conciliacion.component';
import {ConciliacionRoutingModule} from './conciliacion.routing';
import { ReportesConComponent } from './reportes-con/reportes-con.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ConciliacionComponent, ReportesConComponent],
  imports: [
    ConciliacionRoutingModule,
    AppCustomModule
  ]
})
export class ConciliacionModule { }
