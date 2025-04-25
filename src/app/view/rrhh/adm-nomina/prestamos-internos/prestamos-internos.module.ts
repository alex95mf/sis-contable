import { NgModule } from '@angular/core';
import { PrestamosInternosComponent } from './prestamos-internos.component';
import { PrestamosInternosRoutingModule } from './prestamos-internos.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {ToastModule} from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import {SkeletonModule} from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [PrestamosInternosComponent, ],
  imports: [
    AppCustomModule,
    PrestamosInternosRoutingModule,
    CalendarModule,
    TableModule,
    SkeletonModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    BadgeModule,
  ],
  providers: [
    MessageService
  ]
 
})
export class PrestamosInternosModule { }


