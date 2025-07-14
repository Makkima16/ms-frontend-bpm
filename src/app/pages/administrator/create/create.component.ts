import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../models/user.model';
import { Client } from '../../../models/client.model';
import { SecurityService } from '../../../services/security.service';
import { ClientsService } from '../../../services/clients.service';
import { AdminService } from '../../../services/admin.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
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



    // Admin Mode (sin cambios)
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

            this.cliente.create(newAdmin).subscribe({
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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
