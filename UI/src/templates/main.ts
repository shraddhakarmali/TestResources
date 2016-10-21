// LifeCycle calls are not called on router navigation.
// https://github.com/angular/angular/issues/8012#issuecomment-208940860
// Using router-link to navigate to another component does not invoke the onInit method
// https://github.com/angular/angular/issues/4809

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './environment';
import { bootloader } from '@angularclass/hmr';

import { AppModule } from '../app.module';
/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);
