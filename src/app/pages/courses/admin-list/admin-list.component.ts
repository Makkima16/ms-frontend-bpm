import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Client } from '../../../models/client.model';
import { ClientsService } from '../../../services/clients.service';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent implements OnInit {
  modulo: Course[];



  constructor(private service: CourseService, private router: Router, private activateRoute: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      this.modulo = data["data"];
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
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'El modulo ha sido eliminada correctamente',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  };
  goToUpdate(moduleID: number) {
    this.router.navigate(['courses/update-exam/'+ moduleID]); // Redirige al componente de actualización con el ID del examen
  }

}