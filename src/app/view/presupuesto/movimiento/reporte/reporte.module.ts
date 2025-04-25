import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule} from '@ng-select/ng-select';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ReporteRoutingModule } from './reporte-routing.module';
import { ReporteComponent } from './reporte.component';


@NgModule({
  declarations: [
    ReporteComponent],
  imports: [
    CommonModule,
    AppCustomModule,
    ReporteRoutingModule,
    NgSelectModule,
  ],
  schemas: []
})
export class ReporteModule { }