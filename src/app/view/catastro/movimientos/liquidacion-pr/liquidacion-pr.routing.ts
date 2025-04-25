import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidacionPrComponent } from './liquidacion-pr.component';

const routes: Routes = [
  { path: '', component: LiquidacionPrComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionPrRoutingModule { }
