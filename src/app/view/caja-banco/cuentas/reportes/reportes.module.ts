import { NgModule } from '@angular/core';
import { ReportesComponent } from './reportes.component';
import { ReportsRoutingModule } from './reportes.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ReportesComponent],
  imports: [
    ReportsRoutingModule,
    AppCustomModule
  ]
})
export class ReportsBancoModule { }
