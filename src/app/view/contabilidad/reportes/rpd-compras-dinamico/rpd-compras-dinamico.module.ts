import { NgModule } from '@angular/core';
import { RpdComprasDinamicoComponent } from './rpd-compras-dinamico.component';  
import { RpdComprasDinamicoRoutingModule } from './rpd-compras-dinamico.routing'; 
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {DragDropModule} from 'primeng/dragdrop';
import {DividerModule} from 'primeng/divider';


@NgModule({
  declarations: [RpdComprasDinamicoComponent, ],
  imports: [

    RpdComprasDinamicoRoutingModule,
    AppCustomModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DragDropModule,
    DividerModule
    
  ]
 
})
export class RpdComprasDinamicoModule { }
