import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {GestioncobroComponent} from './gestioncobro.component';
import {GestionCobroRoutingModule} from './gestioncobro.routing'
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [GestioncobroComponent],
  imports: [
    FormsModule,
    AppCustomModule,
    GestionCobroRoutingModule
  ]
})
export class GestionCobroModule { }
