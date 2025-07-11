import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {
  modulo: Course[];
  isModalOpen: boolean;

  service = inject(CourseService);
  router = inject(Router);
  activateRoute = inject(ActivatedRoute);
  



    // Abrir modal
    openModal() {
      const modal = document.getElementById('courseModal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    }
  
  
    // Cerrar modal
    closeModal() {
      const modal = document.getElementById('courseModal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }
  

  list(cursoTipo: string) {
      this.service.listByCursoTipo(cursoTipo).subscribe(data => {
        this.modulo = data;  // Asignar directamente los datos devueltos
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar Clietne',
      text: "Está seguro que quiere este modulo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).
          subscribe(() => {
            Swal.fire(
              'Eliminado!',
              'El modulo ha sido eliminada correctamente',
              'success'
            )
          });
      }
    })
  };
  goToUpdate(moduleID: number) {
    this.router.navigate(['courses/update-exam/'+ moduleID]); // Redirige al componente de actualización con el ID del examen
  }

}