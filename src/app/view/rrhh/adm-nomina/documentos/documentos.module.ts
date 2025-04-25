import { NgModule } from '@angular/core';
import { DocumentosComponent } from './documentos.component';
import { DocumentosRoutingModule } from './documentos.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';



@NgModule({
  declarations: [DocumentosComponent],
  imports: [
    AppCustomModule,
    DocumentosRoutingModule
  ]
})
export class DocumentosModule { }
