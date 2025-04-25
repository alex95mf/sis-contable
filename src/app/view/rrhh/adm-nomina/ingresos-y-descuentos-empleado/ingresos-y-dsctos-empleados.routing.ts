import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IngresosYDescuentosEmpleadoComponent } from "./ingresos-y-descuentos-empleado.component";
export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'ingresos-y-descuentos-empleado'
        },
        children: [
            {
                path: '',
                component: IngresosYDescuentosEmpleadoComponent,
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
export class IngresosYDsctosEmpleadoRoutingModule{}


