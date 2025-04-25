import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CierreDeImpuestosComponent } from "./cierre-de-impuestos.component"; 

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cierre-de-impuestos'
        },
        children: [
            {
                path: '',
                component: CierreDeImpuestosComponent,
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
export class CierreDeImpuestosRoutingModule{}