import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { SecurityService } from '../../services/security.service';
import { ClientsService } from '../../services/clients.service';
import { AdminService } from '../../services/admin.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  theUser: User;
  clientes: Client;
  mode: number;
  token: string;
  isLoading: boolean;
  confirmPassword: string; // <- Añadido

  constructor() {
    this.mode = 0;
    this.isLoading = false;
    this.theUser = {
      email: '',
      password: '',
      name: '',
      apellido: '',
      token: ''
    };
    this.clientes = {
      tel: '',
      cedula: ''
    };
  }

  service = inject(SecurityService);
  router = inject(Router);
  cliente = inject(ClientsService);
  admin = inject(AdminService);

  changeMode(mode: number) {
    this.mode = +mode;
    if (this.mode === 0 || this.mode === 2) {
      this.theUser.token = '';
    }
  }

  onSubmit() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (
    !this.theUser.email ||
    !this.theUser.name ||
    !this.theUser.apellido ||
    !this.theUser.password ||
    !this.confirmPassword ||
    !this.clientes.tel ||
    !this.clientes.cedula
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de continuar.',
      confirmButtonColor: '#2C2566'
    });
    return;
  }

    if (this.theUser.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Por favor asegúrate de que ambas contraseñas sean iguales.',
        confirmButtonColor: '#2C2566'
      });
      return;
    }
    if (!passwordRegex.test(this.theUser.password)) {
    Swal.fire({
      icon: 'error',
      title: 'Contraseña insegura',
      text: 'Tu contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      confirmButtonColor: '#2C2566'
    });
    return;
  }

    this.isLoading = true;

    if (this.mode === 0) {
      this.service.create(this.theUser).subscribe({
        next: (response) => {
          try {
            if (response && response._id) {
              const newClient = {
                email: this.theUser.email,
                name: this.theUser.name,
                apellido: this.theUser.apellido,
                user_id: response._id,
                tel: this.clientes.tel,
                cedula: this.clientes.cedula
              };

              this.cliente.create(newClient).subscribe({
                next: () => {
                  this.isLoading = false;
                  Swal.fire('Éxito', 'Usuario creado con éxito', 'success');
                  this.router.navigate(['/']);
                },
                error: (error) => {
                  this.isLoading = false;
                  console.error('Error al crear el cliente:', error);
                  Swal.fire('Error', 'Hubo un problema al crear el cliente', 'error');
                }
              });
            } else {
              this.isLoading = false;
              Swal.fire('Registro fallido', 'Hubo un problema durante el registro', 'error');
            }
          } catch (err) {
            this.isLoading = false;
            Swal.fire('Error', err.message, 'error');
          }
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Error', 'El correo ya está asociado o hubo un problema al registrar el usuario', 'error');
        }
      });
    }

    // Admin Mode (sin cambios)
    else if (this.mode === 1) {
      this.service.admin(this.theUser).subscribe({
        next: (response) => {
          try {
            if (response && response._id) {
              const newAdmin = {
                email: this.theUser.email,
                name: this.theUser.name,
                apellido: this.theUser.apellido,
                user_id: response._id,
                tel: this.clientes.tel,
                cedula: this.clientes.cedula
              };

              this.cliente.create(newAdmin).subscribe();
              this.admin.create(newAdmin).subscribe({
                next: () => {
                  this.isLoading = false;
                  Swal.fire('Éxito', 'Administrador creado con éxito', 'success');
                  this.router.navigate(['/']);
                },
                error: () => {
                  this.isLoading = false;
                  Swal.fire('Error', 'Hubo un problema al crear el administrador', 'error');
                }
              });
            } else {
              this.isLoading = false;
              Swal.fire('Token inválido', 'Hubo un error en el registro del token', 'error');
            }
          } catch (err) {
            this.isLoading = false;
            Swal.fire('Error', err.message, 'error');
          }
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Error', 'El token es inválido o hubo un problema al registrar el administrador', 'error');
        }
      });
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
