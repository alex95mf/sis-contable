import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TramitesComponent } from './tramites.component';

const routes: Routes = [{ path: '', component: TramitesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramitesRoutingModule { }
