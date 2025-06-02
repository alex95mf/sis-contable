import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRegisterComponent } from './customers-register.component';
import { CustomerRegisterRoutingModule } from './customers-register.routing';
import { TabsComponent } from './tabs/tabs.component';
import { AnexosComponent } from './tabs/anexos/anexos.component';
import { ContactosComponent } from './tabs/contactos/contactos.component';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { BancariaComponent } from './tabs/bancaria/bancaria.component';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';


@NgModule({
  declarations: [CustomersRegisterComponent,TabsComponent,ContactosComponent,AnexosComponent, BancariaComponent],
  imports: [
    CommonModule,
    CustomerRegisterRoutingModule,
    CommonModule,
    CommonModalModule,
    AppCustomModule,
    TreeViewModule
  ],
})
export class CustomersRegisterModule { }
