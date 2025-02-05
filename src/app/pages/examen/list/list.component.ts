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
  exams: any[] = []; // Guardamos los exámenes con el título del módulo
  loading: boolean = false;

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.fetchExams();
  }

  fetchExams(): void {
    this.loading = true;
    this.examService.list().subscribe(
      (response: any) => {
        this.exams = response.data.map((exam: any) => ({
          id: exam.id,
          title: exam.title,
          information: exam.information,
          courseTitle: exam.course ? exam.course.titulo : 'Sin curso'
        }));
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
      title: 'Eliminar Examen',
      text: "¿Está seguro de que quiere eliminar este examen?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.examService.delete(id).subscribe(() => {
          Swal.fire('Eliminado!', 'El examen ha sido eliminado correctamente', 'success');
          this.fetchExams(); // Recargar la lista después de eliminar
        });
      }
    });
  }

  goToUpdate(examId: number) {
+    this.router.navigate(['examen/update-exam/' + examId]); // Redirigir al componente de actualización con el ID del examen
  }
}
