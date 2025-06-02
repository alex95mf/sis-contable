import { NgModule } from '@angular/core';;
import { PedidosComponent } from './pedidos.component';
import { PedidosRoutingModule } from './pedidos.routing';
import { DataTablesModule } from 'angular-datatables';
import { DiferedCuotesComponent } from './difered-cuotes/difered-cuotes.component';
import { ShowPedidosComponent } from './show-pedidos/show-pedidos.component';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [PedidosComponent, DiferedCuotesComponent, ShowPedidosComponent],
  imports: [
    PedidosRoutingModule,
    DataTablesModule,
    AppCustomModule
  ],
})
export class PedidosModule { }
