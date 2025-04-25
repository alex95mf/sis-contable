import { NgModule } from '@angular/core';
import { GrupoComponent } from './grupo.component';
import { GrupoRoutingModule } from './grupo.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  imports: [
    GrupoRoutingModule,
    AppCustomModule
  ],
  declarations: [GrupoComponent]
})
export class GrupoModule { }
