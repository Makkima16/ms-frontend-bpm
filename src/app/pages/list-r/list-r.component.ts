import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Records } from '../../models/records.model';
import { RegisterService } from '../../services/register.service';
import { Client } from '../../models/client.model';
import { ModulesClients } from '../../models/modules-clients.model';
import { ClientsService } from '../../services/clients.service';
import { ExamService } from '../../services/exam.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list-r.component.html',
  styleUrls: ['./list-r.component.scss']
})
export class ListRComponent implements OnInit {
  registro: Records[];
  cliente: Client[];
  Examen:ModulesClients[];





  service=inject(RegisterService)
  router=inject(Router)
  activateRoute=inject(ActivatedRoute)
  ClienteServices=inject(ClientsService)
  examServices=inject(ExamService)
  ngOnInit(): void {

    this.list();

  }

  list() {
    forkJoin({
      registros: this.service.list(),
      clientes: this.ClienteServices.list(),
      examenes: this.examServices.list()
    }).subscribe(({ registros, clientes, examenes }) => {
      const clienteMap = new Map(clientes["data"].map(cliente => [cliente.id, cliente.name]));
      const examenMap = new Map(examenes["data"].map(examen => [examen.id, examen.title]));
  
      this.registro = registros["data"].map(record => ({
        ...record,
        clientName: clienteMap.get(record.client_id) || 'Desconocido',
        examenTitle: examenMap.get(record.examen_id) || 'Desconocido',
        aprobacionSymbol: record.aprobacion === 1 ? "✔️" : "❌",
      }));
    });
  }
  
  







}