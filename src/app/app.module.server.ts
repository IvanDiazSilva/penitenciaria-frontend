import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { App } from './app';

import { serverRoutes } from './app.routes.server';

@NgModule({
  imports: [],
  providers: [provideServerRendering(withRoutes(serverRoutes))],
 
})
export class AppServerModule {}
