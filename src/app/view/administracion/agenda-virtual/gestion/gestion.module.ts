import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRoutingModule } from './gestion-routing.module';
import { GestionComponent } from './gestion.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { CalendarModule } from 'angular-calendar';
import { GestionFormComponent } from './gestion-form/gestion-form.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    GestionComponent,
    GestionFormComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    GestionRoutingModule,
    CalendarModule
  ]
})
export class GestionModule { }
