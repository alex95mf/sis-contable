import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RpdComprasDinamicoComponent } from "./rpd-compras-dinamico.component"; 

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'rpd-compras-dinamico'
        },
        children: [
            {
                path: '',
                component: RpdComprasDinamicoComponent,
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
export class RpdComprasDinamicoRoutingModule{}