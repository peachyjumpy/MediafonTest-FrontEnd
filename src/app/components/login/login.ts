import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {
    this.http.post<any>('https://localhost:7250/api/login/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);

        this.router.navigate(['/applications']);
      },
      error: () => {
        alert('Invalid username or password');
      }
    });
  }
}