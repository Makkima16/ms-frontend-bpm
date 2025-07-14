/* eslint-disable @typescript-eslint/no-explicit-any */
function shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModulesClients } from '../../../models/modules-clients.model';
import { RegisterService } from '../../../services/register.service';
import { Records } from '../../../models/records.model';
import { ExamService } from '../../../services/exam.service';
import { ClientsService } from '../../../services/clients.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {
  private timerInterval: any; // Guarda la referencia del temporizador

  mode: number;
  examen: ModulesClients;
  theFormGroup: FormGroup;
  trySend: boolean;
  registros: Records
  questions: any[] = []; // Aquí guardaremos las preguntas
  email:string;
  cliente_id:number;
  answer:boolean;
  session = JSON.parse(sessionStorage.getItem('sesion'));  // Usamos sessionStorage para la sesión
  timeLeft: 900; // 15 minutos en segundos
  tipo:string;
  private hasStartedTimer = false;

  constructor(

  ) { 
    this.trySend = false;
    this.mode = 1;
    this.examen = { information:'', module_id:0, title:'' };  
    this.registros = { id: 0, question1:'', question2:'', question3:'', answer1:'', answer2:'', answer3:'', examen_id:0, client_id:0, aprobacion:false};  

    this.theFormGroup = this.theFormBuilder.group({}); // Inicializa el FormGroup vacío

  }

  activateRoute=inject(ActivatedRoute)
  service=inject(ExamService)
  theFormBuilder=inject(FormBuilder)
  router=inject(Router)
  record=inject(RegisterService)
  clientServices=inject(ClientsService)

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval); // Detiene el temporizador cuando el usuario se va
    }
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email = decodedToken.email;
    }
  
    this.clientServices.buscarPorEmail(this.email).subscribe(client => {
      if (client && client.id) {
        this.cliente_id = client.id;
      }
    // ⏳ **Iniciar el temporizador de 15 minutos**
    this.startTimer();
    });
  
    this.activateRoute.queryParams.subscribe(params => {
      const module_id = params['module_id'];
      const exam_id = this.activateRoute.snapshot.params['id']; // Obtener el id del examen de los parámetros de la ruta
      this.tipo = params['tipo']
      if (exam_id) {
        // Obtener los datos del examen usando view
        this.service.view(exam_id).subscribe(
          exam => {
            this.examen = exam; // Asignar los datos del examen
          },
          error => {
            console.error('Error al cargar el examen:', error);
          }
        );
      } else {
        console.error('El id del examen no está disponible en la ruta.');
      }
  
      if (module_id) {
        // Obtener las preguntas del examen
        this.service.getQuestionsByModule(module_id).subscribe(
          (data) => {
            this.questions = shuffleArray(data);
  
            this.questions = this.questions.map(question => {
              const choices = [
                question.correct_choice,
                question.choice_one,
                question.choice_two,
                question.choice_three
              ];
              question.shuffledChoices = shuffleArray(choices);
              return question;
            });
  
            this.configFormGroup();
          },
          error => {
            console.error('Error al cargar las preguntas:', error);
          }
        );
      } else {
        console.error('module_id es undefined');
      }
    });


  }
  

  // Método para iniciar el temporizador
  startTimer(): void {
    if (this.hasStartedTimer) return; // ⛔ Evita múltiples timers

    this.hasStartedTimer = true;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
        Swal.fire({
          title: "Tiempo agotado",
          text: "Superaste el límite de tiempo",
          icon: "warning",
          confirmButtonText: "Aceptar"
        }).then(() => {
          this.router.navigate(['courses/list?type=' + this.tipo]);
        });
      }
    }, 1000);
  }

  formatTime(): string {
    if (typeof this.timeLeft !== 'number' || isNaN(this.timeLeft)) {
      return '00:00';  // o "Cargando..."
    }

    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
  configFormGroup() {
    // Creación dinámica del formulario basado en las preguntas
    const formControls = this.questions.reduce((acc, question) => {
      acc[question.id] = ['', Validators.required];
      return acc;
    }, {});
    
    this.theFormGroup = this.theFormBuilder.group(formControls);
  }

  onSubmit() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      // Obtenemos las respuestas seleccionadas por el usuario
      Swal.fire("Error", "Por favor, responda todas las preguntas", "error");
    } else {
      const answers = this.theFormGroup.value;
      const registro: Records = {
        question1: this.questions[0]?.text || '',
        question2: this.questions[1]?.text || '',
        question3: this.questions[2]?.text || '',
        answer1: answers[this.questions[0]?.id] || '',
        answer2: answers[this.questions[1]?.id] || '',
        answer3: answers[this.questions[2]?.id] || '',
        examen_id: this.activateRoute.snapshot.params['id'],
        client_id: this.cliente_id,
        aprobacion: false // Inicialmente seteo a false, pero se actualizará si las respuestas son correctas
      };
  
      let correctAnswersCount = 0;
  
      // Comparar las respuestas elegidas con las respuestas correctas
      for (const question of this.questions) {
        const userAnswer = answers[question?.id];
        const correctAnswer = question?.correct_choice;
        if (userAnswer === correctAnswer) {
          correctAnswersCount++;
        }
      }
      // Si el número de respuestas correctas es 3, actualizamos 'aprobacion' a true
      if (correctAnswersCount === 3) {
        registro.aprobacion = true;
        Swal.fire(
          'Terminado!',
          `Respuestas correctas: ${correctAnswersCount}`,
          'success'
        );
      }else{
        Swal.fire(
          'Fallaste!',
          `Respuestas correctas: ${correctAnswersCount}`,
          'error'
        );
      }
  

  
      // Redirigir al usuario
      this.router.navigate([`courses/list`], { queryParams: { type: this.tipo}});
  
      // Guardar el registro usando el servicio
      this.record.create(registro).subscribe({
        error: (error) => {
          console.error('Error al guardar el registro:', error);
        }
      });
    }
  }
  

}