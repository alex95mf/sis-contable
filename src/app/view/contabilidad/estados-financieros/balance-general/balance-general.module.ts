import { NgModule } from '@angular/core';
import { BalanceGeneralComponent } from './balance-general.component';
import { BalanceGeneralRoutingModule } from './balance-general.routing';
import { ExcelService } from '../../../../services/excel.service';
import { ShowCabComponent } from './show-cab/show-cab.component';
import { ShowDetComponent } from './show-det/show-det.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [BalanceGeneralComponent, ShowCabComponent, ShowDetComponent],
    imports: [
        BalanceGeneralRoutingModule,
        AppCustomModule,
        CalendarModule
    ], providers: [
        ExcelService
    ]
})
export class BalanceGeneralModule { }
