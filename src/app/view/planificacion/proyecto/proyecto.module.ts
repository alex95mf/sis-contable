import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcelService } from 'src/app/services/excel.service';

import { ProyectoRoutingModule } from './proyecto-routing.module';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { AsigncionComponent } from './asigncion/asigncion.component';
import { BienesComponent } from './asigncion/bienes/bienes.component';
import { AtribucionDetComponent } from './asigncion/atribucion-det/atribucion-det.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { ComprasComponent } from './compras/compras.component';
import { VisualizadorComponent } from './visualizador/visualizador.component';
import { RegistroComponent } from './registro/registro.component';
import { ModalComponent } from './registro/modal/modal.component';
// import { ModalBuscaCodigoComponent } from './compras/modal-busca-codigo/modal-busca-codigo.component';
import { ModalBuscaCodigoComponent } from './presupuesto/modal-busca-codigo/modal-busca-codigo.component';
import { TareasComponent } from './asigncion/tareas/tareas.component';
import { ModalCodigoComprasComponent } from './compras/modal-codigo-compras/modal-codigo-compras.component';
import { ModalNuevaAtribucionComponent } from './asigncion/modal-nueva-atribucion/modal-nueva-atribucion.component';
import { DialogService } from 'primeng/dynamicdialog';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ModalCuentPreComponent} from './asigncion/bienes/modal-cuent-pre/modal-cuent-pre.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { ProyectoFormComponent } from './proyectos/proyecto-form/proyecto-form.component';
@NgModule({
  declarations: [
    AsigncionComponent,ModalCuentPreComponent,
    BienesComponent,
    AtribucionDetComponent,
    PresupuestoComponent,
    ComprasComponent,
    VisualizadorComponent,
    RegistroComponent,
    ModalComponent,
    ModalBuscaCodigoComponent,
    TareasComponent,
    ModalCodigoComprasComponent,
    ModalNuevaAtribucionComponent,
    ProyectosComponent,
    ProyectoFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    ProyectoRoutingModule,MatTooltipModule
  ],
  providers: [
    ExcelService,
    DialogService,
  ]
})
export class ProyectoModule { }
