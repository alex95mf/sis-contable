import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CierreDeAnioComponent } from "./cierre-de-anio.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cierre-de-anio'
        },
        children: [
            {
                path: '',
                component: CierreDeAnioComponent,
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
export class CierreDeAnioRoutingModule{}


