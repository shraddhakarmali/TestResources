import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { App } from './app';

@NgModule({
  imports:      [
                    BrowserModule,
                    FormsModule,
                    HttpModule
                ],
  declarations: [
                    App
                    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap:    [ App ],
})

export class AppModule { }
