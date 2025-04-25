import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GastosPersonalesComponent } from "./gastos-personales.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: '',
                component: GastosPersonalesComponent,
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
export class GastosPersonalesRoutingModule{}


