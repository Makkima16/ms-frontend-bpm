import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  exams: any[] = []; // Aquí guardaremos los exámenes
  loading: boolean = false;

  constructor(private examService: ExamService, private router:Router) {}

  ngOnInit(): void {
    this.fetchExams();
  }

  fetchExams(): void {
    this.loading = true;
    this.examService.list().subscribe(
      (response: any) => {
        console.log('Exámenes cargados:', response);
        this.exams = response.data; // Asegúrate de extraer 'data' del objeto
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los exámenes:', error);
        this.loading = false;
      }
    );
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar Clietne',
      text: "Está seguro que quiere este cliente?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.examService.delete(id).
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'El Departamento ha sido eliminada correctamente',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  };
  goToUpdate(examId: number) {
    console.log(examId)
    this.router.navigate(['examen/update-exam/'+ examId]); // Redirige al componente de actualización con el ID del examen
  }
}
