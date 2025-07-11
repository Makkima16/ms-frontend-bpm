import { Component, inject, OnInit } from '@angular/core';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../services/clients.service';
import { ExamService } from '../../../services/exam.service';
import Swal from 'sweetalert2';
import { AprobadosService } from '../../../services/aprobados.service';
import { Aprobados } from '../../../models/aprobados.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    clientId: number | null = null;
    courses: (Course & { isApproved?: boolean })[] = []; // Agregamos la propiedad 'isApproved'
    email: string | null = null;
    allModulesCompleted: boolean; // Variable para controlar si todos los módulos están aprobados
    cedula:string
    name:string
    type:string

    service = inject(CourseService);
    router=inject(Router)
    ExamServices=inject(ExamService)
    clientService=inject(ClientsService)
    AprobadosServices=inject(AprobadosService)
    route=inject(ActivatedRoute)
    
    ngOnInit(): void {
      const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
  
      if (token) {
        const decodedToken = this.decodeToken(token);
        this.email = decodedToken.email;
      }

      this.route.queryParams.subscribe(params => {
        this.type = params['type'] || '';
      });
  
      this.list(this.type); // Obtener los módulos dinámicamente
    }
  
    list(cursoTipo: string) {
      this.service.listByCursoTipo(cursoTipo).subscribe(data => {
        this.courses = data;

        const token = sessionStorage.getItem('sesion');
        if (!token) return;

        const decodedToken = this.decodeToken(JSON.parse(token).token);
        const email = decodedToken.email;
        if (!email) return;

        this.email = email;

        this.clientService.buscarPorEmail(email).subscribe(client => {
          if (!client?.id) return;

          this.clientId = client.id;
          this.cedula = client.cedula;
          this.name = client.name;

          let approvedCount = 0;

          this.courses.forEach(course => {
            this.ExamServices.checkModuleApproval(client.id, course.id).subscribe(response => {
              course.isApproved = response.has_passed;

              if (response.has_passed) {
                approvedCount++;
              }

              if (approvedCount !== this.courses.length) return;

              this.allModulesCompleted = true;

              this.AprobadosServices.getAprobadoByClientId(this.clientId).subscribe(aprobado => {
                if (aprobado?.correo) return;

                const enviarCorreo = () => {
                  this.AprobadosServices.correos_automaticos(this.name, this.email, this.cedula).subscribe({
                    next: () => {
                      aprobado.correo = true;
                      this.AprobadosServices.update(aprobado).subscribe({
                        error: err => console.error('Error al actualizar aprobado:', err)
                      });
                    },
                    error: err => console.error('Error al enviar correo automático:', err)
                  });
                };

                if (!aprobado) {
                  const nuevo = { client_id: this.clientId, correo: false } as Aprobados;

                  this.AprobadosServices.create(nuevo).subscribe({
                    next: (nuevoAprobado) => {
                      aprobado = nuevoAprobado;
                      enviarCorreo();
                    },
                    error: err => console.error('Error al crear aprobado:', err)
                  });
                } else {
                  enviarCorreo();
                }
              });
            });
          });
        });
      });
    }
    
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        this.router.navigate(['/home']);
        return;
      }
    
      this.clientService.buscarPorEmail(this.email).subscribe({
        next: (client) => {
          if (client && client.id) {
            const currentIndex = this.courses.findIndex(course => course.id === courseId);
  
            if (currentIndex === -1) {
              console.error('No se encontró el módulo en la lista.');
              return;
            }
  
            if (currentIndex === 0) {
              this.router.navigate([`courses/view/${courseId}`]);
              return;
            }
  
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
        this.router.navigate(['/home']);
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
                    this.router.navigate(['/home']);
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
  