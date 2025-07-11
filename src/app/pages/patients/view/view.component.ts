import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patients } from '../../../models/patients.model';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  patient: Patients | null = null;
  patientId: number;


  route=inject(ActivatedRoute);
  patientService=inject(PatientService)
  router=inject(Router)

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patientId = +params['id'];
      if (this.patientId) {
        this.getPatient();
      } else {
        this.router.navigate(['/alarmas/admin-list']);
      }
    });
  }

  getPatient() {
    this.patientService.view(this.patientId).subscribe({
      next: (data) => {
        this.patient = data;
      },
      error: (err) => {
        console.error("Error al obtener el paciente", err);
      }
    });
  }
}
