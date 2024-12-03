import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientsService } from '../../services/clients.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-list',
  templateUrl: './list-c.component.html',
  styleUrls: ['./list-c.component.scss']
})
export class ListCComponent implements OnInit {
  cliente: Client[];



  constructor(private service: ClientsService, private router: Router, private activateRoute: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      this.cliente = data["data"];
    });
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
        this.service.delete(id).
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


}