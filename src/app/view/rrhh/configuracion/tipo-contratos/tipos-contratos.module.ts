import { NgModule } from '@angular/core';
import { TipoContratosComponent } from './tipo-contratos.component';
import { TiposContratosRoutingModule } from './tipos-contratos.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { NuevoTipoContratoComponent } from './nuevo-tipo-contrato/nuevo-tipo-contrato.component';


@NgModule({
  declarations: [TipoContratosComponent, NuevoTipoContratoComponent, ],
  imports: [
    AppCustomModule,
    TiposContratosRoutingModule,
    SkeletonModule,
    ToastModule,
    TabMenuModule,
    TabViewModule,
    TableModule,
    ButtonModule
  ]
 
})
export class TiposDeContratosModule { }


