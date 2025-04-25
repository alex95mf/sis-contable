import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AnexosListComponentDis } from '../anexos-list/anexos-list-dis.component';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';



@NgModule({
  declarations: [
    TicketComponent,
    TicketFormComponent,
    AnexosListComponentDis,
    CategoriaFormComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    AppCustomModule
  ]
})
export class TicketModule { }
