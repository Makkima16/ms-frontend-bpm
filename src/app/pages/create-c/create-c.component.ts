import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-c.component.html',
  styleUrls: ['./create-c.component.css'],
})
export class CreateCComponent implements OnInit {
  courseForm: FormGroup;
  isImageValid = true; // Verificación para la imagen (en este caso, URL)

  constructor(private fb: FormBuilder, private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      introduccion: ['', [Validators.required, Validators.minLength(10)]],
      informacion: ['', [Validators.required, Validators.minLength(10)]],
      conclusion: [''],
      link: ['', [Validators.pattern('https?://.+')]], // Validación para URL
      imagen_url: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validación para URL de imagen
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

    this.courseService.create(formData).subscribe({
      next: (response) => {
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
