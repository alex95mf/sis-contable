import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SupplierRoutingModule} from './suppliers.routing'
import {SuppliersComponent} from './suppliers.component'
import {TabsComponent} from './tabs/tabs.component'
import {ContactComponent} from './tabs/contact/contact.component'
import {AnexosComponent } from './tabs/anexos/anexos.component' 
import {CommonModalModule} from '../../../commons/modals/modal.module' 
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';


@NgModule({
  declarations: [SuppliersComponent,TabsComponent,ContactComponent,AnexosComponent],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    AppCustomModule,
    CommonModalModule,
    DropDownTreeModule
  ],
  entryComponents: [  
  ]
  
})
export class SuppliersModule { }
