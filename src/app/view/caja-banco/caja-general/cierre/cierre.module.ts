import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CierreComponent } from './cierre.component';
import { CierreRoutingModule } from './cierre.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowDenominationCierreComponent } from './show-denomination-cierre/show-denomination-cierre.component';
import { ShowCajaBancoComponent } from './show-caja-banco/show-caja-banco.component';
import { ShowAccountComponent } from './show-account/show-account.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ShowDetailPaymentComponent } from './show-detail-payment/show-detail-payment.component';
import { ForceCierreComponent } from './force-cierre/force-cierre.component';
@NgModule({
  declarations: [CierreComponent, ShowDenominationCierreComponent, ShowCajaBancoComponent, ShowAccountComponent, ShowDetailPaymentComponent, ForceCierreComponent],
  imports: [
    CommonModule,
    CierreRoutingModule,
    NgSelectModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    AppCustomModule
  ],
})
export class CierreModule { }
