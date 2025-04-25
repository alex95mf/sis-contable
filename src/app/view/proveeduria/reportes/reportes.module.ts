import { NgModule } from '@angular/core';
import { ReportesComponent } from './reportes.component';
import {ReportesRoutingModule} from './reportes.routing';
import { AppCustomModule } from '../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ReportesComponent],
  imports: [
    AppCustomModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }
