import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArriendoterrenosComponent } from  '../liquidacion/arriendoterrenos.component';
const routes: Routes = [
{
  path: '',
  data: {
      title: 'ArriendoTerrenos'
  },
  children: [
      {
          path: 'liquidacion',
          component: ArriendoterrenosComponent,
          data: {
              title: ' ArriendosTerrenos'
          }
      },
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArriendoterrenosRoutingModule { }
