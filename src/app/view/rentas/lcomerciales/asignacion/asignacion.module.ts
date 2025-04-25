import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignacionRoutingModule } from './asignacion-routing.module';
import { AsignacionComponent } from './asignacion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { FormInspectorComponent } from './form-inspector/form-inspector.component';


@NgModule({
  declarations: [
    AsignacionComponent,
    FormInspectorComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    AsignacionRoutingModule
  ]
})
export class AsignacionModule { }
