import { NgModule } from '@angular/core';
import { DiariogeneralComponent } from './diariogeneral.component'; 
import { DiarioGeneralRoutingModule } from './diariogeneral.routing'; 

import { AppCustomModule } from 'src/app/config/custom/app-custom.module'; 

import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ExcelService } from 'src/app/services/excel.service';



@NgModule({
  declarations: [DiariogeneralComponent, ],
  imports: [
    DiarioGeneralRoutingModule,
    AppCustomModule,
    TabViewModule,
    TabMenuModule,
    TableModule,
    CalendarModule,
  ],
  providers: [
    ExcelService,
  ]
 
})
export class DiarioGeneralModule { }


