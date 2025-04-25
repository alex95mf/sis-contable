import { NgModule } from '@angular/core';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module'; 
import { TrasnferenciaDepositosRoutingModule } from './trasnferencia-depositos.routing';
import { TrasnferenciaDepositosComponent } from './trasnferencia-depositos.component';
import { CalendarModule } from 'primeng/calendar';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [TrasnferenciaDepositosComponent],
  imports: [
    AppCustomModule,
    TrasnferenciaDepositosRoutingModule,
    CalendarModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
    NgxCurrencyModule
  ]
})
export class TrasnferenciaDepositosModule { }