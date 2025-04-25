import { NgModule } from '@angular/core';
import {ComprasComponent} from './compras.component';
import {ComprasRoutingModule} from './compras.routing';
import { DiferedBuyProvComponent } from './difered-buy-prov/difered-buy-prov.component';
import { ShowInvoicesComponent } from './show-invoices/show-invoices.component';
import { AppCustomModule } from '../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ComprasComponent, DiferedBuyProvComponent, ShowInvoicesComponent],
  imports: [
    ComprasRoutingModule,
    AppCustomModule
    
  ],
  entryComponents: [
    DiferedBuyProvComponent,
    ShowInvoicesComponent
  ]
})
export class ComprasModule { }
