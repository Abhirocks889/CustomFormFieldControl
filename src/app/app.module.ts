import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoubleInputFormModule } from './double-input-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatLegacyFormFieldModule as MatFormFieldModule,
} from '@angular/material/legacy-form-field';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DoubleInputFormModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
