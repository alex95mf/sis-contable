import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TicketComponent } from './ticket.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'ticket'
    },
    children: [
        {
          path: '',
          component: TicketComponent,
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
export class TicketRoutingModule { }
