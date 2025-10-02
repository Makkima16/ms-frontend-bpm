
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environments';

import LogRocket from 'logrocket';

LogRocket.init('buksaz/bpm-valencia');
const loader = document.getElementById('global-loader');
const start = Date.now();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
  .then(() => {
    const elapsed = Date.now() - start;
    const remaining = 5000 - elapsed;

    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loader.remove(), 500);
      }
    }, remaining > 0 ? remaining : 0);
  });
