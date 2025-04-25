import { NgModule } from '@angular/core';
import { ReporteCxpComponent } from './reporte-cxp.component';
import { ReporteCxpRoutingModule } from './reporte-cxp.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ReporteCxpComponent],
  imports: [
    ReporteCxpRoutingModule,
    AppCustomModule
  ]
})
export class ReporteCxpModule { }
