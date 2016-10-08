// LifeCycle calls are not called on router navigation.
// https://github.com/angular/angular/issues/8012#issuecomment-208940860
// Using router-link to navigate to another component does not invoke the onInit method
// https://github.com/angular/angular/issues/4809

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
