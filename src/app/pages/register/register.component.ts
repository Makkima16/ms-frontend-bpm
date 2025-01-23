import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class RegisterComponent implements OnInit, OnDestroy {
  theUser: User;
  clientes:Client
  mode: number; // 0: normal user, 1: admin user
  token: string;
  isLoading: boolean = false; // Estado de carga agregado

  constructor(
    private service: SecurityService,
    private router: Router,
    private cliente: ClientsService,
    private admin:AdminService
  ) {
    this.mode = 0; // Por defecto, modo usuario normal
    this.theUser = {
      email: '',
      password: '',
      name: '',
      token: '' // Inicializa el token vacío
    };
    this.clientes={
      tel:'',
      cedula:''
    }
  }

  ngOnInit() {}

  ngOnDestroy() {}

  changeMode(mode: number) {
    this.mode = +mode; // Asegúrate de convertir a número
    console.log('Mode changed to:', this.mode);
    if (this.mode === 0) {
      this.theUser.token = ''; // Limpia el token si es usuario normal
    }
    if (this.mode === 2) {
      this.theUser.token = ''; // Limpia el token si es usuario normal
    }
  }

  onSubmit() {
    this.isLoading = true; // Inicia el estado de carga
    if (this.mode === 0) {
      // Crear usuario normal
      this.service.create(this.theUser).subscribe({
        next: (response) => {
          this.isLoading = true; // Inicia el estado de carga
          try {
            if (response && response._id) {
              // Crear el cliente asociado al usuario
              const newClient = {
                email: this.theUser.email,
                name: this.theUser.name,
                user_id: response._id,
                tel:this.clientes.tel,
                cedula:this.clientes.cedula
              };
  
              this.cliente.create(newClient).subscribe({
                next: () => {
                  Swal.fire('Éxito', 'Usuario creado con éxito', 'success');
                  this.router.navigate(['/dashboard']);

                },
                error: (error) => {
                  this.isLoading = false; // Finaliza el estado de carga

                  console.error('Error al crear el cliente:', error);
                  Swal.fire('Error', 'Hubo un problema al crear el cliente', 'error');
                }
              });
            } else {
              Swal.fire('Registro erroneo', 'Hubo un problema durante el registro', 'error');
            }
          } catch (err) {
            this.isLoading = false;
            console.error('Error en la lógica del cliente:', err);
            Swal.fire('Error', err.message, 'error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al crear el usuario:', error);
          Swal.fire('Error', 'El correo ya está asociado o hubo un problema al registrar el usuario', 'error');
        }
      });
    } else if (this.mode === 1) {
      // Crear administrador
      this.service.admin(this.theUser).subscribe({
        next: (response) => {
          this.isLoading = false;
          try {
            if (response && response._id) {
              // Crear el administrador asociado al usuario
              const newAdmin = {
                email: this.theUser.email,
                name: this.theUser.name,
                user_id: response._id,
                tel:this.clientes.tel,
                cedula:this.clientes.cedula
              };
              this.cliente.create(newAdmin).subscribe()
              this.admin.create(newAdmin).subscribe({
                next: () => {
                  Swal.fire('Éxito', 'Administrador creado con éxito', 'success');
                  this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                  this.isLoading = false;

                  console.error('Error al crear el administrador:', error);
                  Swal.fire('Error', 'Hubo un problema al crear el administrador', 'error');
                }
              });
            } else {
              Swal.fire('Token Invalido', 'Hubo un error en el Registro del token', 'error');
            }
          } catch (err) {
            this.isLoading = false;
            console.error('Error en la lógica del administrador:', err);
            Swal.fire('Error', err.message, 'error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al crear el administrador:', error);
          Swal.fire('Error', 'El token es inválido o hubo un problema al registrar el administrador', 'error');
        }
      });
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
}
