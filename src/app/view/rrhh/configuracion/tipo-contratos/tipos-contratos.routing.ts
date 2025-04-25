import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TipoContratosComponent } from "./tipo-contratos.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'tipo-contrato'
        },
        children: [
            {
                path: '',
                component: TipoContratosComponent,
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
export class TiposContratosRoutingModule{}


