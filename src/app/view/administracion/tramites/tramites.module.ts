import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramitesRoutingModule } from './tramites-routing.module';
import { BandejaTrabajoComponent } from './bandeja-trabajo/bandeja-trabajo.component';
import { TramiteComponent } from './tramite/tramite.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { SeguimientoFormComponent } from './bandeja-trabajo/seguimiento-form/seguimiento-form.component';
import { GestionFormComponent } from './bandeja-trabajo/gestion-form/gestion-form.component';
import { AnexosListComponentDis } from './anexos-list/anexos-list-dis.component';
import { CheckboxModule } from 'primeng/checkbox';



@NgModule({
  declarations: [    
    TramiteComponent,    
  ],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    AppCustomModule,
    CheckboxModule
  ]
})
export class TramitesModule { }
