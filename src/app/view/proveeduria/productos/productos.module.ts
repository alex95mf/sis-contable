import { NgModule } from '@angular/core';
import {ProductosComponent} from './productos.component';
import {ProductosRoutingModule} from './productos.routing';
import { AppCustomModule } from '../../../config/custom/app-custom.module';


@NgModule({
  declarations: [ProductosComponent],
  imports: [
    ProductosRoutingModule,
    AppCustomModule
  ]
})
export class ProductosModule { }
