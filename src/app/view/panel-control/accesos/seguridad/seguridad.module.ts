import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { SeguridadComponent } from './seguridad.component';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { TablePermisosComponent } from './component/table-permisos/table-permisos.component';
import { TableRolesComponent } from './component/table-roles/table-roles.component';
import { TablePremisosDocComponent } from './component/table-premisos-doc/table-premisos-doc.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  imports: [
    FormsModule,
    SeguridadRoutingModule,
    DataTablesModule,
    BaseChartDirective,
    BsDropdownModule,
    NgSelectModule,
    CommonModule,
    NgbModule,
    AppCustomModule,
    ButtonsModule.forRoot()
  ],
  declarations: [SeguridadComponent, TablePermisosComponent, TableRolesComponent, TablePremisosDocComponent]
})


export class SeguridadModule { }
