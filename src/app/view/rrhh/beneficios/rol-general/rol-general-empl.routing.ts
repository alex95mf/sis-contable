import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RolGeneralComponent } from "./rol-general.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'roles'
        },
        children: [
            {
                path: '',
                component: RolGeneralComponent,
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
export class RolGeneralRoutingModule{}


