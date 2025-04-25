import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ConsultaComponent } from "./consulta.component";
import { ConsultaRoutingModule } from "./consulta.routing";
import { AppCustomModule } from "src/app/config/custom/app-custom.module";
import { ShowPlanComponent } from './show/show.component';

@NgModule({
    declarations: [ConsultaComponent, ShowPlanComponent],
    imports: [
        CommonModule,
        ConsultaRoutingModule,
        AppCustomModule
    ],
    entryComponents: []
})

export class PlanConsultaModule {  }