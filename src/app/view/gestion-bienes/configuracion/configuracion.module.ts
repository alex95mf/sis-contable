import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ProductoComponent } from './producto/producto.component';
import { CategoriaProductoComponent } from './categoria-producto/categoria-producto.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { TabsIngresoComponent } from './producto/tabs-ingreso/tabs-ingreso.component';
import { ListDocumentosComponent } from './producto/list-documentos/list-documentos.component';
import { ListBusquedaComponent } from './producto/list-busqueda/list-busqueda.component';
import { ModalGruposComponent } from './producto/modal-grupos/modal-grupos.component';
import { ModalNuevoComponent } from './producto/modal-nuevo/modal-nuevo.component';
import { ModalBodegaComponent } from './producto/modal-bodega/modal-bodega.component'; 
import { CalendarModule } from 'primeng/calendar';
//import { ListaPreciosComponent } from './lista-precios/lista-precios.component';
@NgModule({
  declarations: [
    
    // CategoriaProductoComponent,
    ProductoComponent,
    TabsIngresoComponent,
    ListDocumentosComponent,
    ListBusquedaComponent,
    ModalGruposComponent,
    ModalNuevoComponent,
    ModalBodegaComponent,
    //ListaPreciosComponent
   
    
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    FormsModule,
    CommonModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AppCustomModule,
    CalendarModule

  ],

  
})
export class ConfiguracionModule { }
