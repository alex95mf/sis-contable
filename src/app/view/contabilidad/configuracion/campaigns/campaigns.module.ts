import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignsRoutingModule } from './campaigns.routing';
import { CampaignsComponent } from './campaigns.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { ModalCampaignDetailsComponent } from './modal-campaign-details/modal-campaign-details.component';
import { BreadcrumbModule } from '@coreui/angular';


@NgModule({
  declarations: [
    CampaignsComponent,
    ModalCampaignDetailsComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    AppCustomModule,
    NgxCurrencyDirective,
    CampaignsRoutingModule
  ],
  providers: [
    ExcelService,
  ]
})
export class CampaignsModule { }
