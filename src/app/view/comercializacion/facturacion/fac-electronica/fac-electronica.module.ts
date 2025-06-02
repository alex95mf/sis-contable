import { NgModule } from '@angular/core';
import { FacElectronicaRoutingModule } from './fac-electronica.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { FacElectronicaComponent } from './fac-electronica.component';
import { TipoFacturaComponent } from './tipo-factura/tipo-factura.component';
import { FacPdfComponent } from './fac-pdf/fac-pdf.component';
import { ImprimirComElectComponent } from './imprimir-com-elect/imprimir-com-elect.component';
import { EditarXmlComponent } from './editar-xml/editar-xml.component';
import { TipoLiquidacionComponent } from './tipo-liquidacion/tipo-liquidacion.component';
import { MasDetalleComponent } from './mas-detalle/mas-detalle.component';
import { TipoNcreditoComponent } from './tipo-ncredito/tipo-ncredito.component';
import { TipoRetencionComponent } from './tipo-retencion/tipo-retencion.component';

@NgModule({
  declarations: [
    FacElectronicaComponent,
    TipoFacturaComponent,
    FacPdfComponent,
    ImprimirComElectComponent,
    EditarXmlComponent,
    MasDetalleComponent,
    TipoLiquidacionComponent,
    TipoNcreditoComponent,
    TipoRetencionComponent
  ],
  imports: [
    FacElectronicaRoutingModule,
    AppCustomModule
  ],
  exports: [
    TipoFacturaComponent,
    FacPdfComponent,
    ImprimirComElectComponent,
    EditarXmlComponent,
    MasDetalleComponent,
    TipoLiquidacionComponent,
    TipoNcreditoComponent,
    TipoRetencionComponent
  ]
})
export class FacElectronicaModule { }
