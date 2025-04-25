

import { NgModule } from '@angular/core';
import { DfdComponent } from './dfd.component';
import { DfdRoutingModule } from './dfd-routing.module';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
@NgModule({
  declarations: [DfdComponent],
  imports: [ AppCustomModule,DfdRoutingModule],
  providers: [],
  bootstrap: [DfdComponent],
})
export class DfdModule {}

