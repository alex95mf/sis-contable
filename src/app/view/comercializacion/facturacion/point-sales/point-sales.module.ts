import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PointSalesComponent} from './point-sales.component';
import {PointSalesRoutingModule} from './point-sales.routing'

@NgModule({
  declarations: [PointSalesComponent],
  imports: [
    CommonModule,
    PointSalesRoutingModule
  ]
})
export class PointSalesModule { }
