import { Component, OnInit } from '@angular/core';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { Router } from '@angular/router';
import { ClientsService } from '../../../services/clients.service';
import { ExamService } from '../../../services/exam.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  clientId: number | null = null;
  courses: Course[];
  email: string | null = null;

  constructor(
    private service: CourseService,
    private router: Router,
    private ExamServices: ExamService,
    private clientService: ClientsService
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email = decodedToken.email;
    }

    //this.hasPaid();
    this.list(); // Obtener los módulos dinámicamente
  }

  // Método para obtener los módulos desde el backend
  list() {
    this.service.list().subscribe(data => {
      this.courses = data["data"];
    });
  }

  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  module(courseId: number): void {
    if (!this.email) {
      console.error('No se encontró el cliente activo en SessionStorage.');
      this.router.navigate(['/dashboard']);
      return;
    }
  
    this.clientService.buscarPorEmail(this.email).subscribe({
      next: (client) => {
        if (client && client.id) {
          // Encuentra el módulo actual basado en su posición en la lista ordenada
          const currentIndex = this.courses.findIndex(course => course.id === courseId);
  
          if (currentIndex === -1) {
            console.error('No se encontró el módulo en la lista.');
            return;
          }
  
          // Permitir acceso al primer módulo
          if (currentIndex === 0) {
            this.router.navigate([`courses/view/${courseId}`]);
            return;
          }
  
          // Verificar aprobación del módulo anterior
          const previousModuleId = this.courses[currentIndex - 1].id;
          this.ExamServices.checkModuleApproval(client.id, previousModuleId).subscribe({
            next: (response) => {
              if (response.has_passed) {
                this.router.navigate([`courses/view/${courseId}`]);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Examen Incompleto',
                  text: `Complete antes el módulo ${this.courses[currentIndex - 1].titulo} para poder avanzar.`,
                  allowOutsideClick: false,
                });
              }
            },
            error: (error) => {
              console.error('Error al comprobar la aprobación del módulo:', error);
            },
          });
        } else {
          console.error('No se encontró el cliente con el email proporcionado.');
        }
      },
      error: (error) => {
        console.error('Error al buscar el cliente:', error);
      },
    });
  }
  

  hasPaid(): void {
    if (!this.email) {
      console.error('No se encontró el cliente activo en SessionStorage.');
      this.router.navigate(['/dashboard']);
    }

    this.clientService.buscarPorEmail(this.email).subscribe({
      next: (client) => {
        if (client && client.id) {
          this.clientService.checkIfClientPaid({ id: client.id }).subscribe({
            next: (response) => {
              if (!response.hasAccepted) {
                Swal.fire({
                  icon: 'error',
                  title: 'Pago requerido',
                  text: 'Debe realizar el pago antes de continuar.',
                  allowOutsideClick: false,
                }).then(() => {
                  this.router.navigate(['/dashboard']);
                });
              }
            },
            error: (error) => {
              console.error('Error al comprobar si el cliente ha pagado:', error);
            },
          });
        } else {
          console.error('No se encontró un cliente con el email proporcionado.');
        }
      },
      error: (error) => {
        console.error('Error al buscar el cliente por email:', error);
      },
    });
  }
}
