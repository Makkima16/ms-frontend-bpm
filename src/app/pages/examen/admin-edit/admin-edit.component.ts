import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ExamService } from '../../../services/exam.service';
import { QuestionService } from '../../../services/question.service';
import { ModulesClients } from '../../../models/modules-clients.model';
import { Questions } from '../../../models/questions.model';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {
  form: FormGroup;
  examId: number; // ID del examen a actualizar
  trySend: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private questionService: QuestionService
  ) {}

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
        // Prellenar el formulario con datos del examen
        this.form.patchValue({
          title: exam.title,
          information: exam.information,
        });

        // Cargar preguntas relacionadas con el examID
        this.examService.getQuestionsByModule(this.examId).subscribe({
          next: (questions: Questions[]) => {
            questions.forEach((question) => {
              this.questionsArray.push(
                this.fb.group({
                  id: [question.id], // Para diferenciar preguntas existentes
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
