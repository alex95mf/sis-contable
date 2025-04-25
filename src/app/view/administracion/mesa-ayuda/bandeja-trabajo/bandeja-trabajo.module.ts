import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BandejaTrabajoRoutingModule } from './bandeja-trabajo-routing.module';
import { BandejaTrabajoComponent } from './bandeja-trabajo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { GestionFormComponent } from './gestion-form/gestion-form.component';
import { SeguimientoFormComponent } from './seguimiento-form/seguimiento-form.component'; 
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';


@NgModule({
  declarations: [
    BandejaTrabajoComponent,
    GestionFormComponent,
    SeguimientoFormComponent,
    AnexosListComponentDis
  ],
  imports: [
    CommonModule,
    BandejaTrabajoRoutingModule,
    AppCustomModule
  ]
})
export class BandejaTrabajoModule { }
