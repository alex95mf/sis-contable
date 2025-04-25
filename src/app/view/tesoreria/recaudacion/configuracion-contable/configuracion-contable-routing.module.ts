import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionContableComponent } from './configuracion-contable.component';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionContableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionContableRoutingModule { }
