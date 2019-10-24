import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './notfound/notfound.component';

import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './auth-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
//import { FormBuilder } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
    RECAPTCHA_SETTINGS,
    RecaptchaSettings,
    RecaptchaLoaderService,
    RecaptchaModule,
} from 'ng-recaptcha';
import { HeaderComponent } from './home/header/header.component';
import { FooterComponent } from './home/footer/footer.component';
import { AccountComponent } from './account/account.component';
import { SecondaryHeaderComponent } from './secondary-header/secondary-header.component';
import { RegistrationComponent } from './registration/registration.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { AdminGuard } from './routeguard/admin.guard';
import { TestComponent } from './test/test.component';
import { DashHeaderComponent } from './dash-header/dash-header.component';
import { DashSidebarComponent } from './dash-sidebar/dash-sidebar.component';
import { PaymentComponent } from './payment/payment.component';
import { HistoryComponent } from './history/history.component';
import { ReferralsComponent } from './referrals/referrals.component';
import { TransfersComponent } from './transfers/transfers.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { BusinessComponent } from './business/business.component';
import { BackgroundImageResolver } from './resolvers/background-image.resolver';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TableTestComponent } from './_management/table-test/table-test.component';
import { TableHeaderDirective } from './_management/table-header.directive';
import { TableTestHeaderRowComponent } from './_management/table-test/table-test-header-row/table-test-header-row.component';
import { WripetextPipe } from './_management/wripetext.pipe';
import { BannersComponent } from './banners/banners.component';


const globalSettings: RecaptchaSettings = { siteKey: '6LdlRaoUAAAAAEFKWLGFtyzXw57WCoJd_6r4NTa8' };
// 
const appRoutes: Routes = [
    {
        path: '', component: HomeComponent, resolve: {
            background: BackgroundImageResolver
        }
    },
    { path: 'smartcheck', component: TestComponent },
    { path: 'testblock', component: TableTestComponent },
    { path: 'login', component: LoginComponent, canActivate: [AdminGuard] },
    { path: 'sponsor/:sponsorid', component: RegistrationComponent, canActivate: [AdminGuard] },
    { path: 'registration', component: RegistrationComponent, canActivate: [AdminGuard] },
    { path: 'recovery', component: RecoveryComponent },
    { path: 'contact', component: ContactUsComponent },
    { path: 'account', component: AccountComponent, canActivate: [AdminGuard] },
    { path: 'payment', component: PaymentComponent, canActivate: [AdminGuard] },
    { path: 'history', component: HistoryComponent, canActivate: [AdminGuard] },
    { path: 'transfers', component: TransfersComponent, canActivate: [AdminGuard] },
    { path: 'withdrawal', component: WithdrawalComponent, canActivate: [AdminGuard] },
    { path: 'referrals', component: ReferralsComponent, canActivate: [AdminGuard] },
    { path: 'business', component: BusinessComponent, canActivate: [AdminGuard] },
    { path: 'banners', component: BannersComponent, canActivate: [AdminGuard] },
    { path: '**', component: NotFoundComponent }
];


@NgModule({
    entryComponents: [HomeComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        NotFoundComponent,
        HeaderComponent,
        FooterComponent,
        AccountComponent,
        SecondaryHeaderComponent,
        RegistrationComponent,
        RecoveryComponent,
        TestComponent,
        DashHeaderComponent,
        DashSidebarComponent,
        PaymentComponent,
        HistoryComponent,
        TransfersComponent,
        WithdrawalComponent,
        BusinessComponent,
        ReferralsComponent,
        ContactUsComponent,
        TableTestComponent,
        TableHeaderDirective,
        TableTestHeaderRowComponent,
        WripetextPipe,
        BannersComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes,
            { preloadingStrategy: PreloadAllModules }),
        RecaptchaModule.forRoot(),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [ApiService, CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: globalSettings,
        }, BackgroundImageResolver
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
