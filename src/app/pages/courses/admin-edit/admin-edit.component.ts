import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { ModulesClients } from '../../../models/modules-clients.model';
import { Questions } from '../../../models/questions.model';
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
  trySend: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private services: CourseService,
  ) {}

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
          pdf_name:modulo.pdf_name
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
      titulo: this.form.value.title,
      introduccion: this.form.value.introduccion,
      informacion: this.form.value.informacion, 
      conclusion: this.form.value.conclusion,
      link: this.form.value.link,
      imagen_url:this.form.value.imagen_url,
      pdf_name:this.form.value.pdf_name

    };

    this.services.update(moduloData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'El examen y las preguntas han sido actualizados correctamente', 'success');
        this.router.navigate(['/course/admin-list']);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el examen', 'error');
        console.error(err);
      }
    });
  }
}
