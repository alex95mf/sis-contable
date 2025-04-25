import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionContableComponent } from './configuracion-contable.component';


export const routes: Routes = [
  {
      path: '',
      data: {
          title: 'roles'
      },
      children: [
          {
              path: '',
              component: ConfiguracionContableComponent,
              data: {
                  title: ''
              }
          },

      ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionContableRoutingModule { }



