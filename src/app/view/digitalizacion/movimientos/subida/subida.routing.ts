import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubidaComponent} from './subida.component';

const routes: Routes = [
  { path: '', component: SubidaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubidaRoutingModule { }
