import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Aprobados } from '../../../models/aprobados.model';
import { AprobadosService } from '../../../services/aprobados.service';
import { Client } from '../../../models/client.model';
import { forkJoin } from 'rxjs';
import { ClientsService } from '../../../services/clients.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  aprobado: Aprobados[];
  cliente: Client[];



  service = inject(AprobadosService);
  router = inject(Router);
  activateRoute = inject(ActivatedRoute);
  clienteServices = inject(ClientsService);
  

  ngOnInit(): void {
    this.list();
  }

list() {
    forkJoin({
      aprobados: this.service.list(),
      clientes: this.clienteServices.list(),
    }).subscribe(({ clientes, aprobados }) => {
      const clienteMap = new Map(clientes["data"].map(cliente => [cliente.id, cliente.name]));
      const emailMap = new Map(clientes["data"].map(cliente => [cliente.id, cliente.email]));
      const telMap = new Map(clientes["data"].map(cliente => [cliente.id, cliente.tel]));
      const cedulaMap = new Map(clientes["data"].map(cliente => [cliente.id, cliente.cedula]));

      this.aprobado = aprobados["data"].map(record => ({
        ...record,
        clientName: clienteMap.get(record.client_id) || 'Desconocido',
        clientEmail: emailMap.get(record.client_id) || 'Desconocido',
        clienttel: telMap.get(record.client_id) || 'Desconocido',
        clientcedula: cedulaMap.get(record.client_id) || 'Desconocido',

        aprobacionSymbol: record.correo === 1 ? "✔️" : "❌",
      }));
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar aprobado',
      text: "Está seguro que quiere este aprobados?",
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
              'El aprobados ha sido eliminada correctamente',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  };
  goToSendEmail(clientEmail: string, id: number) {
    this.router.navigate(['/aprobados/admin-correo'], { queryParams: { email: clientEmail, id: id } });
  }
  
}