import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

// CDK
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';

// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

// Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// Syncfusion
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { BarcodeGeneratorAllModule, QRCodeGeneratorAllModule, DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';

// CoreUI v5
import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule as CoreUISharedModule,
  SidebarModule,
  TabsModule as CoreUITabsModule,
  UtilitiesModule,
  WidgetModule
} from '@coreui/angular';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';

// Charts - Updated to ng2-charts
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';

// Other libraries
import { QRCodeComponent } from 'angularx-qrcode';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { FlatpickrModule } from 'angularx-flatpickr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// App modules
import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppRoutingModule } from './app.routing';
import { AppCustomModule } from './config/custom/app-custom.module';

// Settings and services
import { AppSettings } from './app.settings';
import { ApiServices } from './services/api.service';
import { GuardSystem } from './services/guardSystem';
import { AuthorizationService } from './services/auth-service';
import { GuardLogin } from './services/guardLogin.service';
import { Socket } from './services/socket.service';
import { CommonService } from './services/commonServices';
import { CommonVarService } from './services/common-var.services';
import { CookieService } from 'ngx-cookie-service';

// Components
import { AppComponent } from './app.component';
import { TopInfoContentComponent } from './theme/components/top-info-content/top-info-content.component';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { NavbarComponent } from './theme/components/navbar/navbar.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { FavoritesComponent } from './theme/components/favorites/favorites.component';

// Containers
import { DefaultLayoutComponent } from './containers';

// Error pages
import { P404Component } from './view/error/404.component';
import { P500Component } from './view/error/500.component';

// Views
import { HomeComponent } from './view/home/home.component';
import { NewHomeComponent } from './view/new-home/new-home.component';
import { EditPassComponent } from './containers/default-layout/edit-pass/edit-pass.component';
import { MaintenanceComponent } from './view/comercializacion/facturacion/maintenance/maintenance.component';

// Import flatpickr styles
import 'flatpickr/dist/flatpickr.css';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  declarations: [
    AppComponent,
    TopInfoContentComponent,
    SidenavComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FavoritesComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    HomeComponent,
    NewHomeComponent,
    EditPassComponent,
    MaintenanceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,

    // Perfect Scrollbar
    // PerfectScrollbarModule,

    // Calendar
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),

    // App modules
    SharedModule,
    PipesModule,
    AppRoutingModule,
    AppCustomModule,

    // Syncfusion
    DatePickerModule,
    TreeViewModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,

    // CoreUI v5
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    HeaderModule,
    ListGroupModule,
    NavModule,
    ProgressModule,
    CoreUISharedModule,
    SidebarModule,
    CoreUITabsModule,
    UtilitiesModule,
    WidgetModule,

    // Bootstrap
    NgbModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),

    // Charts - Updated to ng2-charts
    // NgChartsModule,
    BaseChartDirective,

    // Other libraries
    // QRCodeComponent,
    QRCodeComponent,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgSelectModule,
    NgxPrintModule,
    FlatpickrModule.forRoot(),
    InfiniteScrollModule,
    NgxBarcode6Module,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    AppSettings,
    ApiServices,
    CommonService,
    CommonVarService,
    CookieService,
    GuardSystem,
    AuthorizationService,
    GuardLogin,
    Socket,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideCharts(withDefaultRegisterables()),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    }),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
