import { NgModule } from '@angular/core';
import { CargaFamiliarComponent } from './carga-familiar.component';
import { CargaFamiliarRoutingModule } from './carga-familiar.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  declarations: [CargaFamiliarComponent],
  imports: [
    AppCustomModule,
    CargaFamiliarRoutingModule
  ]
})
export class CargaFamiliarModule { }
