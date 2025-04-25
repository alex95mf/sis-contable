import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SalesManagerComponent } from './components/sales-manager/sales-manager.component';
import { SellerComponent } from './components/seller/seller.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgxChartsModule,
    ButtonsModule.forRoot()
  ],
  declarations: [DashboardComponent, SalesManagerComponent, SellerComponent]
})
export class DashboardModule { }
