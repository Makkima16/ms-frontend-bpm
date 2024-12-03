import { Token } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import { error } from 'console';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  theUser: User;
  mode: number; // 0: first log, 1: second authentication
  token: string;
  isLoading: boolean = false; // Estado de carga


  constructor(private service: SecurityService, private router: Router) {
    this.mode = 0;
    this.theUser = {
      email: "",
      password: "",
    };
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  login() {
    this.isLoading = true; // Mostrar el estado de carga
    this.service.login(this.theUser).subscribe({
      next: (data) => {
        this.theUser._id = data["id"];
        this.mode = 1;
        this.isLoading = false; // Ocultar el estado de carga
      },
      error: (error) => {
        console.log("Error" + JSON.stringify(error));
        this.isLoading = false; // Ocultar el estado de carga
        Swal.fire(
          "Autenticación invalida",
          "Usuario o contraseña incorrectos",
          "error"
        );
      },
    });
  }

  secondAuth() {
    this.isLoading = true; // Mostrar el estado de carga
    this.service.secondAuth(this.theUser._id, this.token).subscribe({
      next: (data) => {
        this.isLoading = false; // Ocultar el estado de carga
        this.service.saveSession(data);
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.log("Error" + JSON.stringify(error));
        this.isLoading = false; // Ocultar el estado de carga
        Swal.fire(
          "Autenticación invalida",
          "Token incorrecto",
          "error"
        );
      },
    });
  }
  
  register(){
    this.router.navigateByUrl('/register');

  }

  back(){
    this.router.navigateByUrl('/dashboard');

  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
}
