import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInfoRoutingModule } from './user-info.routing';
import { UserInfoComponent } from './user-info.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    // SharedModule,  // Para los componentes propios del tema
    NgxCurrencyModule,
    UserInfoRoutingModule
  ]
})
export class UserInfoModule { }
