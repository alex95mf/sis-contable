import { NgModule } from '@angular/core';
import { FolderDigitalEmpleadoComponent } from './folder-digital-empleado.component';
import { RhFolderDigitalEmpleadoRoutingModule } from './rhfolder-digital-empleado.routing';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { TableModule } from 'primeng/table';
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";


@NgModule({
  declarations: [FolderDigitalEmpleadoComponent, ],
  imports: [
    RhFolderDigitalEmpleadoRoutingModule,
    AppCustomModule,
    TableModule,
    MessagesModule,
    MessageModule,
  ]
 
})
export class RhFolderDigitalEmpleadoModule { }


