import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CierreSuperavitRoutingModule } from './cierre-superavit.routing';
import { CierreSuperavitComponent } from './cierre-superavit.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    CierreSuperavitComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    MatTableModule,
    CierreSuperavitRoutingModule
  ]
})
export class CierreSuperavitModule { }
