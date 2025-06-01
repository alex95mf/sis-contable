import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifConfigRoutingModule } from './notif-config.routing';
import { NotifConfigComponent } from './notif-config.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalAlertasComponent } from './modal-alertas/modal-alertas.component';


@NgModule({
  declarations: [
    NotifConfigComponent,
    ModalAlertasComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NgxCurrencyDirective,
    NotifConfigRoutingModule
  ]
})
export class NotifConfigModule { }
