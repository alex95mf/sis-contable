import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ConsultaCobrosRoutingModule } from './consulta-cobros-routing.module';
import { ConsultaCobrosComponent } from './consulta-cobros.component';
import { ModalUsuariosComponent } from './modal-usuarios/modal-usuarios.component'; 
import { ExcelService } from 'src/app/services/excel.service';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [
    ConsultaCobrosComponent,
    ModalUsuariosComponent,
    
  ],
  imports: [
    CommonModule,
    ConsultaCobrosRoutingModule,
    AppCustomModule,
    CheckboxModule,
  ],
  providers: [
    ExcelService
  ]
})
export class ConsultaCobrosModule { }
