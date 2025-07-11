import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrl: './admin-create.component.css'
})
export class AdminCreateComponent implements OnInit {
  courseForm: FormGroup;
  isImageValid = true; // Verificación para la imagen (en este caso, URL)

  fb = inject(FormBuilder)
  courseService = inject(CourseService)

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      introduccion: ['', [Validators.required, Validators.minLength(10)]],
      informacion: ['', [Validators.required, Validators.minLength(10)]],
      conclusion: [''],
      link: ['', [Validators.pattern('https?://.+')]], // Validación para URL
      imagen_url: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validación para URL de imagen
      pdf_name:['', [Validators.required, Validators.pattern('https?://.+')]], // Validacion para el URL del PDF
      curso_tipo: ['', [Validators.required, Validators.minLength(3)]],

    });
  }

  createCourse(): void {
    if (this.courseForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.courseForm.get('titulo')?.value);
    formData.append('introduccion', this.courseForm.get('introduccion')?.value);
    formData.append('informacion', this.courseForm.get('informacion')?.value);
    formData.append('conclusion', this.courseForm.get('conclusion')?.value);
    formData.append('link', this.courseForm.get('link')?.value);
    formData.append('imagen_url', this.courseForm.get('imagen_url')?.value); // Aquí agregamos la URL de la imagen
    formData.append('pdf_name', this.courseForm.get('pdf_name')?.value); // Aquí agregamos la URL de la imagen
    formData.append('curso_tipo', this.courseForm.get('curso_tipo')?.value); // Aquí agregamos la URL de la imagen

    this.courseService.create(formData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Curso creado correctamente.', 'success');
        this.courseForm.reset();
      },
      error: (error) => {
        console.error('Error al crear el curso:', error);
        Swal.fire('Error', 'No se pudo crear el curso.', 'error');
      },
    });
  }
}
