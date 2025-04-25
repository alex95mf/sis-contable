import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JornadaRoutingModule } from './jornada-routing.module';
import { JornadaComponent } from './jornada.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalJornadaComponent } from './modal-jornada/modal-jornada.component';



@NgModule({
  declarations: [
    JornadaComponent,
    ModalJornadaComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    JornadaRoutingModule
  ]
})
export class JornadaModule { }
