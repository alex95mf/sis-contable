import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';

const routes: Routes = [
{
  path: '',
  data: {
    title: 'plusvalias'
  },
  children: [
    {
      path: 'pliquidacion',
      component: LiquidacionComponent,
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
export class PlusvaliasRoutingModule { }
