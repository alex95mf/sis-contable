import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { EstadosFinancierosRoutingModule } from './estados-finacieros.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    EstadosFinancierosRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    NgbModule,
    ButtonsModule.forRoot()
  ],
  declarations: []
})

export class EstadosFinancierosModule { }
