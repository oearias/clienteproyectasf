import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { NopageFoundComponent } from './nopage-Found/nopage-found/nopage-found.component';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

//Configuracion de la zona horaria


@NgModule({
  declarations: [
    AppComponent,
    NopageFoundComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    HttpClientModule,
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
