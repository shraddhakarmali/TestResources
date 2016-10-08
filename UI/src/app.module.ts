import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import {AppContainer} from './app/components/container/app.container';

@NgModule({
  imports:      [
                    BrowserModule,
                    FormsModule,
                    HttpModule
                ],
  declarations: [
                    AppContainer
                    ],
  bootstrap:    [ AppContainer ],
})

export class AppModule { }
