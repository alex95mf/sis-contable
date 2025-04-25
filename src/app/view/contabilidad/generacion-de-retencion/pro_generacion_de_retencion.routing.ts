import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GeneracionDeRetencionComponent } from "./generacion-de-retencion.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'pro_generacion_de_retencion'
        },
        children: [
            {
                path: '',
                component: GeneracionDeRetencionComponent,
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
export class ProGeneracionRetencionRoutingModule{}