import { NgModule } from '@angular/core';
import { NotaDebitoComponent } from './nota-debito.component';
import { NotaDebitoRoutingModule } from './nota-debito.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module'; 

@NgModule({
  declarations: [NotaDebitoComponent],
  imports: [
    NotaDebitoRoutingModule,
    AppCustomModule
  ]
})
export class NotaDebitoModule { }
