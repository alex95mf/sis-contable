import { NgModule } from '@angular/core';
import { CierreDeAnioComponent } from './cierre-de-anio.component';
import { CierreDeAnioRoutingModule} from './cierre-de-anio.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [CierreDeAnioComponent, ],
  imports: [
    CierreDeAnioRoutingModule,
    AppCustomModule
  ]
 
})
export class CierreAnioModule { }