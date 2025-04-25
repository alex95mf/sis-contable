import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProductoComponent } from './producto.component';
import { ProductoRoutingModule } from './producto.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ProductoRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgbModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ProductoComponent]
})
export class ProductoModule { }
