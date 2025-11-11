import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoginCardComponent } from '../../shared/components/login-card/login-card.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
	standalone: true,
	imports: [
		HeaderComponent,
		LoginCardComponent
	]
})
export class LoginPage {
	onLogin(credentials: { username: string; password: string }): void {
		console.log('Login clicked', credentials);
	}
}
