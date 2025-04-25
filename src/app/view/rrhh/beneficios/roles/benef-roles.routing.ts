import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RolesComponent } from "./roles.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'roles'
        },
        children: [
            {
                path: '',
                component: RolesComponent,
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
export class RolesRoutingModule{}


