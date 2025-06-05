import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AtsRoutingModule } from './ats.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtsComponent } from './ats.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
//import { ReporteEsigefComponent } from './reporte-esigef/reporte-esigef.component';
import { ExcelService } from '../../../../services/excel.service';
import { AnuladosComponent } from './anulados/anulados.component';
import { ComprasComponent } from './compras/compras.component';
import { RetencionesComponent } from './retenciones/retenciones.component';
import { VentasComponent } from './ventas/ventas.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AtsRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgbModule,
    AppCustomModule,
    ButtonsModule.forRoot()
  ],
  declarations: [
    AtsComponent,
    AnuladosComponent,
    ComprasComponent,
    RetencionesComponent,
    VentasComponent
  ],
  providers: [
      ExcelService

  ]
})

export class AtsModule { }
