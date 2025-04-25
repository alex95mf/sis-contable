import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { PrestamoRoutingModule } from './prestamo-routing.module';
import { PrestamoComponent } from './prestamo.component';
import { ModalRegContribuyenteComponent } from './modal-reg-contribuyente/modal-reg-contribuyente.component';




@NgModule({
  declarations: [ModalRegContribuyenteComponent],
  imports: [
    CommonModule,
    PrestamoRoutingModule,
    AppCustomModule
    
  ]
})
export class PrestamoModule { }
