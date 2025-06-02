import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BancariaRoutingModule} from './bancarias.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ShowCuentasComponent } from '../bancarias/show-cuentas/show-cuentas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BancariasComponent } from './bancarias.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  declarations: [BancariasComponent,ShowCuentasComponent],
  imports: [
    BancariaRoutingModule,
    AppCustomModule
  ],
})
export class BancariasModule { }
