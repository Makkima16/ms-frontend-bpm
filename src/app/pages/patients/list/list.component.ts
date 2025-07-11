import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patients } from '../../../models/patients.model';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
  patients: Patients[];
  alarma_id:number;

  service = inject(PatientService);
  router = inject(Router);
  activateRoute = inject(ActivatedRoute)

  ngOnInit(): void {
    // Captura el ID de la alarma desde los query params
    this.activateRoute.queryParams.subscribe(params => {
      this.alarma_id = +params['id'];  // El '+' convierte a number
      if (this.alarma_id) {
        this.list(); // Llama la función que carga los pacientes con ese ID
      }
    });
  }

  list() {
    this.service.byAlarm(this.alarma_id).subscribe(data => {
    this.patients = data;
    });
  }

  viewPatient(id:number){
    this.router.navigate([`pacientes/view`], { queryParams: { id: id } });
  }


}