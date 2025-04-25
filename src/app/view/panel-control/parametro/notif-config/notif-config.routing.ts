import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotifConfigComponent } from './notif-config.component';

const routes: Routes = [
  { path: '', component: NotifConfigComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotifConfigRoutingModule { }
