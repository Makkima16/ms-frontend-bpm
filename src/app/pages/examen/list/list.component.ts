import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CourseService } from '../../../services/course.service';
import { ModulesClients } from '../../../models/modules-clients.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  exams: ModulesClients[] = []; // Lista de exámenes
  modulesMap: Map<number, string> = new Map(); // Mapa para relacionar module_id con el título del módulo
  loading: boolean = false;

  constructor(private examService: ExamService, private router: Router, private courseService: CourseService) {}

  ngOnInit(): void {
    this.fetchExams();
    this.fetchModules(); // Obtener la lista de módulos
  }

  fetchExams(): void {
    this.loading = true;
    this.examService.list().subscribe(
      (response: any) => {
        this.exams = response.data.map((exam: any) => ({
          id: exam.id,
          title: exam.title,
          information: exam.information,
          module_id: exam.module_id // Asegúrate de que el backend devuelva module_id
        }));
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar los exámenes:', error);
        this.loading = false;
      }
    );
  }

  fetchModules(): void {
    this.courseService.list().subscribe(
      (modules: any) => {
        console.log('Respuesta de la API (fetchModules):', modules); // <-- Agregar esta línea

        // Crear un mapa de module_id a título del módulo
        modules.forEach((module: any) => {
          this.modulesMap.set(module.id, module.titulo);
        });
      },
      (error) => {
        console.error('Error al cargar los módulos:', error);
      }
    );
  }

  getModuleTitle(moduleId: number): string {
    return this.modulesMap.get(moduleId) || 'Módulo no encontrado'; // Obtener el título del módulo
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
    this.router.navigate(['examen/update-exam/' + examId]);
  }
}