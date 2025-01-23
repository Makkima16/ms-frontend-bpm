import { Component, OnInit } from '@angular/core';
import { AprobadosService } from '../../../services/aprobados.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Aprobados } from '../../../models/aprobados.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit{
  email: string = ''; // Para el correo del cliente
  selectedFile: File | null = null; // Archivo seleccionado
  message: string = ''; // Mensaje de retroalimentación
  isLoading: boolean = false; // Indicador de carga
  aprobadoId: number;  // ID del aprobado para actualizar
  body: string = '';  // El cuerpo del correo

  constructor(private emailService: AprobadosService, private route: ActivatedRoute,     private router: Router,) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.aprobadoId = params['id'];  // Aquí se obtiene el ID del aprobado
    });
  }

  // Manejar la selección del archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Manejar el envío del formulario
  // Manejar el envío del formulario
onSubmit() {
  if (!this.email || !this.selectedFile || !this.body) {
    this.message = 'Por favor, llena todos los campos.';
    return;
  }

  const formData = new FormData();
  formData.append('email', this.email); // Correo del destinatario
  formData.append('file', this.selectedFile); // Archivo adjunto
  formData.append('text', this.body); // Cuerpo del correo (texto)

  const Data: Aprobados = {
    id: this.aprobadoId,
    correo: true
  };

  // Llama al servicio para enviar el correo
  this.emailService.enviarCorreo(formData).subscribe(
    response => {
      // Mensaje de éxito y limpieza de los campos
      this.message = 'Correo enviado exitosamente.';
      this.email = ''; // Limpia el campo de correo
      this.body = '';  // Limpia el cuerpo del correo
      this.selectedFile = null; // Limpia el archivo seleccionado

      this.emailService.update(Data).subscribe({
        next: () => {
          this.router.navigate(['/aprobados/admin-list']);
        },
        error: (err) => {
          console.error(err);
        }
      });

      // Limpiar el input de archivo en el DOM
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Resetea el valor del campo de archivo
      }
    },
    error => {
      this.message = 'Hubo un error al enviar el correo.';
      console.error(error);
    }
  );
}

  
}
