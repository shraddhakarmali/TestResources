import {
    inject,
    TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AppContainer } from './app.container';


describe('App', () => {
    // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseRequestOptions,
      MockBackend,
      {
        provide: Http,
        useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      }]
  }));


    it ('should work',
    inject([MockBackend, ELClientService],
        (mockBackend, service: ELClientService) => {
        // Add real test here
         mockBackend.connections.subscribe(
              (connection: MockConnection) => {
                connection.mockRespond(new Response(
                      new ResponseOptions({
                            }
          )));
      });

    }));
});
