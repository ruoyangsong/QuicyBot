import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeModule } from './home/home.module';
import { InputBarComponent } from './input-bar/input-bar.component';
import {HttpClientModule} from '@angular/common/http';
import { LyricsPanelComponent } from './lyrics-panel/lyrics-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    InputBarComponent,
    LyricsPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
