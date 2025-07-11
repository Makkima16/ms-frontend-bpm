import { Component, inject, OnInit } from '@angular/core';
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
  examId: number; // ID del examen a actualizar
  trySend: boolean;
  courseTitle: string; // Nuevo: Nombre del curso



  fb=inject(FormBuilder)
  route=inject(ActivatedRoute)
  router=inject(Router)
  examService=inject(ExamService)
  questionService=inject(QuestionService)
  courseService=inject(CourseService)
  ngOnInit(): void {
    // Obtener el ID del examen desde la URL
    this.examId = +this.route.snapshot.paramMap.get('id')!;

    // Inicializar formulario
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      information: ['', [Validators.required, Validators.minLength(10)]],
      questions: this.fb.array([]),
    });

    // Cargar datos del examen y sus preguntas
    this.loadExamData();
  }

  // Getter para el FormArray de preguntas
  get questionsArray(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  // Cargar datos del examen y preguntas relacionadas
  loadExamData() {
    this.examService.view(this.examId).subscribe({
      next: (exam: ModulesClients) => {
        this.form.patchValue({
          title: exam.title,
          information: exam.information,
        });

        if (exam.module_id) {
          this.loadCourseData(exam.module_id); // Nuevo: Cargar datos del curso
        }

        this.examService.getQuestionsByModule(this.examId).subscribe({
          next: (questions: Questions[]) => {
            questions.forEach((question) => {
              this.questionsArray.push(
                this.fb.group({
                  id: [question.id],
                  text: [question.text, Validators.required],
                  choice_one: [question.choice_one, Validators.required],
                  choice_two: [question.choice_two, Validators.required],
                  choice_three: [question.choice_three, Validators.required],
                  correct_choice: [question.correct_choice, Validators.required],
                })
              );
            });
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudieron cargar las preguntas del examen', 'error');
            console.error(err);
          }
        });
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar el examen', 'error');
        console.error(err);
      }
    });
  }

  // Nuevo: Obtener el curso usando el module_id del examen
  loadCourseData(moduleId: number) {
    this.courseService.view(moduleId).subscribe({
      next: (course: Course) => {
        this.courseTitle = course.titulo || 'Curso sin título';
      },
      error: (err) => {
        console.error('Error al cargar el curso:', err);
        this.courseTitle = 'No se pudo obtener el curso';
      }
    });
  }

  // Agregar nueva pregunta al FormArray
  addQuestion() {
    const questionGroup = this.fb.group({
      text: ['', Validators.required],
      choice_one: ['', Validators.required],
      choice_two: ['', Validators.required],
      choice_three: ['', Validators.required],
      correct_choice: ['', Validators.required],
      module_id:[this.examId]
    });
    this.questionsArray.push(questionGroup);
  }

  // Eliminar una pregunta del FormArray
  removeQuestion(index: number) {
    this.questionsArray.removeAt(index);
  }

  // Enviar formulario
  submit() {
    this.trySend = true;

    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente', 'error');
      return;
    }

    // Actualizar el examen
    const examData: ModulesClients = {
      id: this.examId,
      title: this.form.value.title,
      information: this.form.value.information,
    };

    this.examService.update(examData).subscribe({
      next: () => {
        // Procesar las preguntas
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.questionsArray.controls.forEach((questionGroup: any) => {
          const questionData: Questions = questionGroup.value;

          if (questionData.id) {
            // Actualizar pregunta existente
            this.questionService.update(questionData).subscribe({
              next: () => console.log('Pregunta actualizada:', questionData),
              error: (err) => console.error('Error al actualizar pregunta:', err),
            });
          } else {
            // Crear nueva pregunta
            this.questionService.create(questionData).subscribe({
              next: () => console.log('Pregunta creada:', questionData),
              error: (err) => console.error('Error al crear pregunta:', err),
            });
          }
        });

        Swal.fire('Éxito', 'El examen y las preguntas han sido actualizados correctamente', 'success');
        this.router.navigate(['/list-exam']);
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el examen', 'error');
        console.error(err);
      }
    });
  }
}
