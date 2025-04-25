import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PrestamosInternosComponent } from "./prestamos-internos.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'prestamos-internos'
        },
        children: [
            {
                path: '',
                component: PrestamosInternosComponent,
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
export class PrestamosInternosRoutingModule{}


