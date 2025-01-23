import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { ModulesClients } from '../../../models/modules-clients.model';
import { Questions } from '../../../models/questions.model';

@Component({
  selector: 'app-admin-create',

  templateUrl: './admin-create.component.html',
  styleUrl: './admin-create.component.css'
})
export class AdminCreateComponent implements OnInit {
  form: FormGroup;
  courses: Course[] = [];
  trySend: boolean = false;
  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private questionService: QuestionService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.form = this.fb.group({
      course: ['', Validators.required], // Selección del curso
      title: ['', [Validators.required, Validators.minLength(3)]], // Título del examen
      information: ['', [Validators.required, Validators.minLength(10)]], // Información del examen
      questions: this.fb.array([]) // Array de preguntas
    });
    this.form.get('course')?.valueChanges.subscribe((selectedCourseId) => {
      console.log('ID del curso seleccionado:', selectedCourseId);
    });
    // Cargar cursos disponibles
    this.loadCourses();
  }

  // Método para cargar los cursos disponibles
  loadCourses() {
    this.courseService.list().subscribe({
      next: (response: any) => {
        if ('data' in response) {
          this.courses = response['data'];
        } else {
          this.courses = response;
        }
        console.log('Cursos cargados:', this.courses); // Verificar que los cursos tienen IDs
      },
      error: (err) => {
        Swal.fire("Error", "No se pudieron cargar los cursos", "error");
        console.error(err);
      }
    });
  }
  

  // Obtener el array de preguntas
  get questionsArray(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  // Agregar una nueva pregunta al array de preguntas
  addQuestion() {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      choice_one: ['', Validators.required],
      choice_two: ['', Validators.required],
      choice_three: ['', Validators.required],
      correct_choice: ['', Validators.required]
    });
    this.questionsArray.push(questionGroup);
  }

  // Eliminar una pregunta del array
  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  // Enviar el formulario para crear el examen
  submit() {
    this.trySend = true;
    
    // Verificar los valores del formulario
    console.log("Formulario enviado:", this.form.value);
  
    if (this.form.invalid) {
      Swal.fire("Error", "Por favor complete todos los campos correctamente", "error");
      return;
    }
  
    // Asegúrate de que course_id sea solo el id del curso
    const examData: ModulesClients = {
      title: this.form.value.title,
      information: this.form.value.information,
      module_id: this.form.value.course, // Aquí solo pasa el ID del curso
    };
  
    console.log("Datos del examen que se enviarán:", examData);
  
    // Enviar el examen al servidor
    this.examService.create(examData).subscribe({
      next: (createdExam) => {
        console.log("Examen creado:", createdExam);
        
        // Procesar las preguntas asociadas al examen
        this.questionsArray.controls.forEach((questionGroup: any) => {
          const questionData: Questions = {
            module_id: createdExam.id, // Aquí solo pasa el ID del curso
            text: questionGroup.value.text,
            correct_choice: questionGroup.value.correct_choice,
            choice_one: questionGroup.value.choice_one,
            choice_two: questionGroup.value.choice_two,
            choice_three: questionGroup.value.choice_three
          };
  
          this.questionService.create(questionData).subscribe({
            next: (createdQuestion) => {
              console.log("Pregunta creada:", createdQuestion);
            },
            error: (err) => {
              console.error("Error al crear la pregunta:", err);
            }
          });
        });
  
        Swal.fire("Éxito", "El examen ha sido creado correctamente", "success");
      },
      error: (err) => {
        console.error("Error al crear examen:", err);
        Swal.fire("Error", "No se pudo crear el examen", "error");
      }
    });
  }
  
}
