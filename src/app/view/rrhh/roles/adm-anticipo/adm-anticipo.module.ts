import { NgModule } from '@angular/core';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { AdmAnticipoComponent } from './adm-anticipo.component';
import { AdmAnticipoRoutingModule } from './adm-anticipo.routing';



@NgModule({
  declarations: [AdmAnticipoComponent],
  imports: [
    AppCustomModule,
    AdmAnticipoRoutingModule
  ]
})
export class AdmAnticipoModule { }
