import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AsigncionComponent } from './asigncion/asigncion.component';
import { RegistroComponent } from './registro/registro.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { ComprasComponent } from './compras/compras.component';
import { VisualizadorComponent } from './visualizador/visualizador.component';
import { ProyectosComponent } from './proyectos/proyectos.component';

const routes: Routes = [{
  path: '',
  data: {
    title: 'proyecto'
  },
  children: [
    {
      path: 'asignacion',
      component: AsigncionComponent
    },
    {
      path: 'presupuesto',
      component: PresupuestoComponent
    },
    {
      path: 'compras',
      component: ComprasComponent
    },
    {
      path: 'reporte',
      component: VisualizadorComponent
    },
    {
      path: 'registro',
      component: RegistroComponent
    },
    {
      path: 'consulta',
      component: ConsultaComponent
    },
    {
      path: 'proyectos',
      component: ProyectosComponent
    },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectoRoutingModule { }
