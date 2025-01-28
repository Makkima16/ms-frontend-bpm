import { Component, OnInit } from '@angular/core';
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
    allModulesCompleted: boolean = false; // Variable para controlar si todos los módulos están aprobados
    cedula:string
    name:string
    type:string
    constructor(
      private service: CourseService,
      private router: Router,
      private ExamServices: ExamService,
      private clientService: ClientsService,
      private AprobadosServices: AprobadosService,
      private route: ActivatedRoute,
    ) {}
  
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
        this.courses = data;  // Asignar directamente los datos devueltos

        if (this.email) {
          this.clientService.buscarPorEmail(this.email).subscribe(client => {
            if (client?.id) {
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
    
                  if (approvedCount === this.courses.length) {
                    this.allModulesCompleted = true;
    
                    // Verificar si ya existe un "Aprobado" para el cliente
                    this.AprobadosServices.getAprobadoByClientId(this.clientId).subscribe(aprobado => {
                      if (!aprobado) {
                        // Crear un nuevo registro de "Aprobado"
                        const aprobados: Aprobados = {
                          client_id: this.clientId,
                          correo: false
                        };
    
                        this.AprobadosServices.create(aprobados).subscribe({
                          next: (createdAprobado) => {    
                            this.AprobadosServices.correos_automaticos(this.name, this.email, this.cedula).subscribe({
                              next: () => {
                                createdAprobado.correo = true;
                                this.AprobadosServices.update(createdAprobado).subscribe({
                                  error: (error) => {
                                    console.error('Error al actualizar el registro de aprobados:', error);
                                  }
                                });
                              },
                              error: (error) => {
                                console.error('Error al enviar el correo automático:', error);
                              }
                            });
                          },
                          error: (error) => {
                            console.error('Error al crear el registro de aprobado:', error);
                          }
                        });
                      } else {
                        // Si ya existe un registro, enviar correo si no se ha enviado
                        if (!aprobado.correo) {
                          this.AprobadosServices.correos_automaticos(this.name, this.email, this.cedula).subscribe({
                            next: () => {
                              aprobado.correo = true;
                              this.AprobadosServices.update(aprobado).subscribe({
                                error: (error) => {
                                  console.error('Error al actualizar el registro de aprobados:', error);  
                                }
                              });
                            },
                            error: (error) => {
                              console.error('Error al enviar el correo automático:', error);
                            }
                          });
                        }
                      }
                    });
                  }
                });
              });
            }
          });
        }
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
  