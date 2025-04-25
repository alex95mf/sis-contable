import { LOCALE_ID, NgModule } from '@angular/core';
import { FaltasYPermisosComponent } from './faltas-y-permisos.component';
import { FaltasYPermisosRoutingModule } from './per-faltas-y-permisos.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { CalendarModule } from 'primeng/calendar';
import {InputNumberModule} from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";

import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { ToastModule } from 'primeng/toast';
registerLocaleData(localeEs, "es");

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {ChartModule} from 'primeng/chart';
import { AppConfigService } from './AppConfig.services';

// import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [FaltasYPermisosComponent, ],
  imports: [
    FaltasYPermisosRoutingModule,
    AppCustomModule,
    CalendarModule,
    InputNumberModule,
    TableModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    TabMenuModule,
    TabViewModule,
    ChartModule,
    // FormsModule,
  ],

  providers: [{ provide: LOCALE_ID, useValue: "es" }, AppConfigService],

 
})
export class FaltasYPermisosModule { }


