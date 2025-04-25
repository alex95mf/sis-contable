import { NgModule } from '@angular/core';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './benef-roles.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [RolesComponent, ],
  imports: [
    AppCustomModule,
    RolesRoutingModule,
    CalendarModule,
    TableModule
  ]
 
})
export class RolesModule { }


