import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevisionRoutingModule } from './revision-routing.module';
import { RevisionComponent } from './revision.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

@NgModule({
  declarations: [
    RevisionComponent
  ],
  imports: [
    CommonModule,
    RevisionRoutingModule,
    AppCustomModule
  ]
})
export class RevisionModule { }
