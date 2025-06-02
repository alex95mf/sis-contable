import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BovedasRoutingModule } from './bovedas.routing';
import { BovedasComponent } from './bovedas.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ShowCuentasComponent } from '../bovedas/show-cuentas/show-cuentas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [BovedasComponent,ShowCuentasComponent],
  imports: [
    BovedasRoutingModule,
    AppCustomModule
  ],
})
export class BovedasModule { }
