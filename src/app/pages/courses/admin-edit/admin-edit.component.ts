import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {
  form: FormGroup;
  moduloID: number; // ID del examen a actualizar
  trySend: boolean ;


  fb=inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  services = inject(CourseService);



  ngOnInit(): void {
    // Obtener el ID del examen desde la URL
    this.moduloID = +this.route.snapshot.paramMap.get('id')!;

    // Inicializar formulario
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      introduccion: ['', [Validators.required, Validators.minLength(10)]],
      link: ['', [Validators.required, Validators.minLength(10)]],
      informacion: ['', [Validators.required, Validators.minLength(10)]],
      conclusion: ['', [Validators.required, Validators.minLength(10)]],
      imagen_url: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validación para URL de imagen
      pdf_name: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validación para URL de imagen
      curso_tipo: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Cargar datos del examen y sus preguntas
    this.loadModulo();
  }

  // Getter para el FormArray de preguntas


  // Cargar datos del examen y preguntas relacionadas
  loadModulo() {
    this.services.view(this.moduloID).subscribe({
      next: (modulo: Course) => {
        // Prellenar el formulario con datos del examen
        this.form.patchValue({
          titulo: modulo.titulo,
          link: modulo.link,
          introduccion: modulo.introduccion,
          informacion: modulo.informacion,
          conclusion: modulo.conclusion,
          imagen_url:modulo.imagen_url,
          pdf_name:modulo.pdf_name,
          curso_tipo:modulo.curso_tipo
        });
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar el examen', 'error');
        console.error(err);
      }
    });
  }




  // Enviar formulario
  submit() {
    this.trySend = true;

    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente', 'error');
      return;
    }

    // Actualizar el examen
    const moduloData: Course = {
      id: this.moduloID,
      titulo: this.form.value.titulo,
      introduccion: this.form.value.introduccion,
      informacion: this.form.value.informacion, 
      conclusion: this.form.value.conclusion,
      link: this.form.value.link,
      imagen_url:this.form.value.imagen_url,
      pdf_name:this.form.value.pdf_name,
      curso_tipo:this.form.value.curso_tipo


    };

    this.services.update(moduloData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'El examen y las preguntas han sido actualizados correctamente', 'success');
        this.router.navigate(['/courses/admin-list']);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el examen', 'error');
        console.error(err);
      }
    });
  }
}
