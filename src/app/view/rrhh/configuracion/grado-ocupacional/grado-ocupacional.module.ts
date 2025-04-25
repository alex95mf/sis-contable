import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SueldoNuevoComponent } from './grupo-nuevo/sueldo-nuevo.component';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { GradoOcupacionalRoutingModule } from './grado-ocupacional-routing.module';
import { GradoOcupacionalComponent } from './grado-ocupacional.component';

@NgModule({
  declarations: [GradoOcupacionalComponent,SueldoNuevoComponent],
  imports: [
    CommonModule,
    GradoOcupacionalRoutingModule,AppCustomModule
  ]
})
export class GradoOcupacionalModule { }
