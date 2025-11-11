import { Component, EventEmitter, Output } from '@angular/core';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonImg,
	IonInput,
	IonItem,
	IonLabel
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-login-card',
	templateUrl: './login-card.component.html',
	styleUrls: ['./login-card.component.scss'],
	standalone: true,
	imports: [
		FormsModule,
		IonCard,
		IonCardContent,
		IonItem,
		IonLabel,
		IonInput,
		IonButton, 
		IonImg
	]
})
export class LoginCardComponent {
	username = '';
	password = '';

	@Output() login = new EventEmitter<{ username: string; password: string }>();

	onSubmit(): void {
		this.login.emit({ username: this.username, password: this.password });
	}
}

