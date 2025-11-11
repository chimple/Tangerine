import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(App, {
	providers: [
		provideIonicAngular(),
		provideRouter(routes)
	]
}).catch((err) => console.error(err));