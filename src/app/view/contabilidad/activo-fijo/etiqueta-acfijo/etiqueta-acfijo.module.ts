import { NgModule } from '@angular/core';
import { EtiquetaAcfijoComponent } from './etiqueta-acfijo.component';
import { EtiquetaAcfijoRoutingModule } from './etiqueta-acfijo.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  declarations: [EtiquetaAcfijoComponent],
  imports: [
    EtiquetaAcfijoRoutingModule,
    AppCustomModule
  ]
})
export class EtiquetaAcfijoModule { }
