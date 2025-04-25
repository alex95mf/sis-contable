import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodegaComponent } from './bodega.component';
import { BodegaRoutingModule } from './bodega.routing'
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';


/* HASTA AQUI INFORMACION */
@NgModule({
  declarations: [BodegaComponent],
  imports: [
    CommonModule,
    BodegaRoutingModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule


  ],
  entryComponents: []
})
export class BodegaModule { }
