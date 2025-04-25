import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RetencionesGeneradasComponent } from "./retenciones-generadas.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'retenciones-generadas'
        },
        children: [
            {
                path: '',
                component: RetencionesGeneradasComponent,
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
export class RetencionesGeneradasRoutingModule{}