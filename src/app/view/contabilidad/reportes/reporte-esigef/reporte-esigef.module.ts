import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ReporteEsigefRoutingModule } from './reporte-esigef.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReporteEsigefComponent } from './reporte-esigef.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
//import { ReporteEsigefComponent } from './reporte-esigef/reporte-esigef.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReporteEsigefRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgbModule,
    AppCustomModule,
    ButtonsModule.forRoot(),
    NgxCurrencyDirective,
  ],
  declarations: [
    ReporteEsigefComponent
  ]
})

export class ReporteEsigefModule { }
