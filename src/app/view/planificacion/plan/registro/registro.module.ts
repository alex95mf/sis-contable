import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RegistroComponent } from "./registro.component";
import { RegistroRoutingModule } from "./registro.routing";
import { AppCustomModule } from "src/app/config/custom/app-custom.module";
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
    declarations: [RegistroComponent],
    imports: [
        CommonModule,
        RegistroRoutingModule,
        AppCustomModule,
        NgxCurrencyModule,
    ],
    entryComponents: []
})

export class PlanRegistroModule {  }