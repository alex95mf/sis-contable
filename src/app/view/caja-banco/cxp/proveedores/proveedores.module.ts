import { NgModule } from '@angular/core'; 
import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresRoutingModule } from './proveedores.routing'; 
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [ProveedoresComponent],
  imports: [ 
    ProveedoresRoutingModule, 
    AppCustomModule
  ]
})
export class ProveedoresModule { }
