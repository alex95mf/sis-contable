import { NgModule } from '@angular/core';
import { AdquisicionesComponent } from './adquisiciones.component'
import { AdquisicionesRoutingModule } from './adquisiciones.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [AdquisicionesComponent],
  imports: [
    AdquisicionesRoutingModule,
    AppCustomModule
  ],
  entryComponents: []
})
export class AdquisicionesModule { }
