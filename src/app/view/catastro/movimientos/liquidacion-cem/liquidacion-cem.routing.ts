import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionCemComponent } from './liquidacion-cem.component';

const routes: Routes = [
  { path: '', component: LiquidacionCemComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionCemRoutingModule { }
