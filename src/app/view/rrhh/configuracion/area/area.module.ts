import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConceptoFormComponent } from './area-form/concepto-form.component';
import { ModalProgramaComponent } from './modal-programa/modal-programa.component';


@NgModule({
  declarations: [
    AreaComponent,
    ConceptoFormComponent,
    ModalProgramaComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,
    AppCustomModule
  ]
})
export class AreaModule { }
