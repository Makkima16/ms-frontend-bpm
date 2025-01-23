import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { ClientsService } from '../../../services/clients.service';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number;
  course: Course;
  modulo:Course[];
  theFormGroup: FormGroup;
  trySend: boolean;
  safeVideoUrl: SafeResourceUrl;
  courseId: number; // Variable para almacenar el ID del curso actual
  selectedExamId: number; // ID del examen seleccionado al azar

  // Variables de estado para el acordeón
  isTituloOpen: boolean = false;
  isIntroduccionOpen: boolean = false;
  isInformacionOpen: boolean = false;
  isConclusionOpen: boolean = false;
  email:string;
  constructor(
    private activateRoute: ActivatedRoute,
    private service: CourseService,
    private examServices: ExamService,
    private clientService: ClientsService,
    private theFormBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { 
    this.trySend = false;
    this.mode = 1;
    this.course = { id: 0, link: '', titulo: '', introduccion: '', informacion: '', conclusion: '', pdf_name:'' };

  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
  
    if (token) {
      // Si hay un token, decodificarlo para extraer la información del usuario
      const decodedToken = this.decodeToken(token);
      this.email = decodedToken.email; // Asigna el nombre del usuario desde el token
      //this.haspaid(); // Verificar si el cliente ha pagado después de obtener el email
    } else {
      this.router.navigate(['/login']); // Redirigir a login si no hay token
    }
  
    this.configFormGroup();
    this.courseId = +this.activateRoute.snapshot.params['id']; // "+" convierte a número
    
    const currentUrl = this.activateRoute.snapshot.url.join('/');
  
    if (currentUrl.includes('view')) {
      this.mode = 1;
      this.viewVideo(this.activateRoute.snapshot.params['id']);
    }
  
    // Verificar el módulo después de cargar la información del curso
    //this.haspaid();
    this.list();
    //this.verifyModule(this.courseId);
    this.loadAndSelectRandomExam(this.courseId);

  }

  loadAndSelectRandomExam(moduleId: number): void {
    this.service.getExamsByModule(moduleId).subscribe({
      next: (exams) => {
        if (exams.length > 0) {
          const randomIndex = Math.floor(Math.random() * exams.length);
          this.selectedExamId = exams[randomIndex].id; // Selecciona un examen al azar
        } else {
          console.error("No hay exámenes disponibles para este módulo.");
        }
      },
      error: (error) => {
        console.error("Error al obtener exámenes del módulo:", error);
      }
    });
  }
  
  list() {
    this.service.list().subscribe(data => {
      this.modulo = data["data"];
    });
  }
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      _id: [0],
      link: ['', [Validators.required, Validators.pattern(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm)]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }



  viewVideo(id: number) {
    this.service.getVideo(id).subscribe(data => {
      this.course = data;
      this.course.id = id;
  
      if (this.course.link.includes('watch?v=')) {
        // Lógica para YouTube
        const videoId = this.course.link.split('watch?v=')[1];
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      } else if (this.course.link.includes('drive.google.com')) {
        // Lógica para Google Drive
        const fileId = this.extractDriveFileId(this.course.link);
        if (fileId) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://drive.google.com/file/d/${fileId}/preview`);
        } else {
          console.error('No se pudo extraer el ID del archivo de Drive');
        }
      } else {
        // Enlace genérico (otros casos)
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.course.link);
      }
  
      this.theFormGroup.patchValue({
        link: this.course.link
      });
    });
  }
  
  // Método para extraer el ID del archivo de Google Drive
  extractDriveFileId(link: string): string | null {
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  toggleInfo(section: string): void {
    switch (section) {
      case 'titulo':
        this.isTituloOpen = !this.isTituloOpen;
        break;
      case 'introduccion':
        this.isIntroduccionOpen = !this.isIntroduccionOpen;
        break;
      case 'informacion':
        this.isInformacionOpen = !this.isInformacionOpen;
        break;
      case 'conclusion':
        this.isConclusionOpen = !this.isConclusionOpen;
        break;
    }
  }

    // Método para crear y redirigir al examen
    examen(courseId: number) {
      const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
      if (token) {
        // Si hay un token, decodificarlo para extraer la información del usuario
        const decodedToken = this.decodeToken(token);
        this.email = decodedToken.email; // Asigna el nombre del usuario desde el token
      }
  
      this.clientService.buscarPorEmail(this.email).subscribe(
        (client) => {
          if (client && client.id) {

            this.examServices.view(this.selectedExamId).subscribe(
              (response) => {
                this.router.navigate([`examen/view/${this.selectedExamId}`],  { queryParams: { module_id: this.selectedExamId } }); // Redirigir a la vista del examen
              },
              (error) => {
                console.error("Error creating exam:", error);
                Swal.fire("Error", "No se pudo crear el examen. Inténtalo de nuevo.", "error");
              }
            );
          } else {
            Swal.fire("Error", "Cliente no encontrado", "error");
          }
        },
        (error) => {
          console.error("Error fetching client by email:", error);
          Swal.fire("Error", "No se pudo obtener el cliente. Inténtalo de nuevo.", "error");
        }
      );
    }
    decodeToken(token: string): any {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token inválido');
      }
  
      const payload = parts[1];  // El payload es la segunda parte
      const decoded = atob(payload);  // Decodificamos de base64
      return JSON.parse(decoded);  // Retornamos el payload como un objeto
    }

    haspaid(): void {
      // Llamada al servicio para buscar el cliente por email
      if (!this.email) {
        console.error("No se encontró el cliente activo en SessionStorage.");
        this.router.navigate(['/dashboard']); // Redirigir al dashboard
      }
      this.clientService.buscarPorEmail(this.email).subscribe({
        next: (client) => {
          if (client && client.id) {
            // Llamada para verificar si el cliente ya ha pagado
            this.clientService.checkIfClientPaid({ id: client.id }).subscribe({
              next: (response) => {
                if (response.hasAccepted) {
                  return; 
                } else {
                  // Si no ha pagado, mostramos el mensaje y lo redirigimos al dashboard
                  Swal.fire({
                    icon: 'error',
                    title: 'Pago requerido',
                    text: 'Debe realizar el pago antes de continuar.',
                    allowOutsideClick: false
                  }).then(() => {
                    this.router.navigate(['/dashboard']); // Redirigir al dashboard
                  });
                }
              },
              error: (error) => {
                // Manejo de errores en la comprobación del pago
                console.error("Error al comprobar si el cliente ha pagado:", error);
              }
            });
          } else {
            console.error("No se encontró un cliente con el email proporcionado.");
          }
        },
        error: (error) => {
          // Manejo de errores en la búsqueda del cliente
          console.error("Error al buscar el cliente por email:", error);
        }
      });
          // Verificar si hay un email del cliente activo en la sesión
          if (!this.email) {
            Swal.fire({
              icon: 'error',
              title: 'Cuenta requerida',
              text: 'Logueese primero por favor.',
              allowOutsideClick: false
            }).then(() => {
              this.router.navigate(['/login']); // Redirigir al dashboard
            });
          }
    }

    verifyModule(courseId: number): void {
      if (!this.email) {
        console.error("No se encontró el cliente activo en SessionStorage.");
        this.router.navigate(['/dashboard']); // Redirigir al dashboard si no hay email
        return; // Evitar que se ejecute el resto del código
      }
    
      this.clientService.buscarPorEmail(this.email).subscribe({
        next: (client) => {
          if (client && client.id) {
            // Encuentra el índice dinámico del módulo actual
            const currentIndex = this.modulo.findIndex(course => course.id === courseId);
    
            if (currentIndex === -1) {
              console.error('No se encontró el módulo en la lista.');
              this.router.navigate([`courses/list`]); // Redirigir al listado si el módulo no existe
              return;
            }
    
            // Permitir acceso al primer módulo
            if (currentIndex === 0) {
              return;
            }
    
            // Verificar la aprobación del módulo anterior
            const previousModuleId = this.modulo[currentIndex - 1].id;
    
            this.examServices.checkModuleApproval(client.id, previousModuleId).subscribe({
              next: (response) => {
                if (response.has_passed) {
                  // Si el módulo anterior fue aprobado, dejamos continuar
                  return;
                } else {
                  // Si no ha aprobado el módulo anterior, mostramos el mensaje
                  Swal.fire({
                    icon: 'error',
                    title: 'Examen Incompleto',
                    text: `Complete antes el módulo ${this.modulo[currentIndex - 1].titulo} para poder avanzar.`,
                    allowOutsideClick: false
                  });
                  this.router.navigate([`courses/list`]); // Redirigir al listado de cursos
                }
              },
              error: (error) => {
                console.error('Error al comprobar la aprobación del módulo:', error);
              }
            });
          } else {
            console.error("No se encontró un cliente con el email proporcionado.");
          }
        },
        error: (error) => {
          console.error("Error al buscar el cliente:", error);
        }
      });
    }
    
    formatText(text: string): string {
      if (!text) return '';
      return text.replace(/\n/g, '<br>'); // Reemplaza los saltos de línea por <br>
    }
}
