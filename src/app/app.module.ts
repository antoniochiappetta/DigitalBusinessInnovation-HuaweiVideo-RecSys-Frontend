// Angular modules
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Third parties modules
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Starting point
import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

// App components and intereceptors
import { AlertComponent } from './components/utils/alert/alert.component';
import { TokenInterceptor } from './helpers/token.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { RegistrationComponent } from './components/registration/registration.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        MovieDetailComponent,
        RegistrationComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
