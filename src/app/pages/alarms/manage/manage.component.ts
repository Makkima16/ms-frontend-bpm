import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { AlarmService } from '../../../services/alarm.service';
import { PatientService } from '../../../services/patient.service';
import { Alarms } from '../../../models/alarms.model';
import { Patients } from '../../../models/patients.model';
import { ClientsService } from '../../../services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  form: FormGroup;
  trySend = false;
  clientId: number;

  private fb = inject(FormBuilder);
  private alarmServices = inject(AlarmService);
  private patientService = inject(PatientService);
  private clientServices = inject(ClientsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      servidor: ['', Validators.required],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', [Validators.required]],
      patients: this.fb.array([])
    });

    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;

    if (token) {
      const decoded = this.decodeToken(token);
      const email = decoded.email;

      this.clientServices.buscarPorEmail(email).subscribe({
        next: (client) => {
          this.clientId = client.id;
        },
        error: (err) => {
          console.error('No se pudo obtener el cliente', err);
          Swal.fire('Error', 'No se pudo identificar al cliente', 'error');
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  get patientsArray(): FormArray {
    return this.form.get('patients') as FormArray;
  }

  addPatients(): void {
    const patientGroup = this.fb.group({
      name: ['', Validators.required],
      cedula: [null, Validators.required],
      age: [null, Validators.required],
      tetanos: [false],
      tetanos_description: [{ value: '', disabled: true }],
      hepatitis_a: [false],
      hepatitis_a_description: [{ value: '', disabled: true }],
      hepatitis_b: [false],
      hepatitis_b_description: [{ value: '', disabled: true }]
    });

    patientGroup.get('tetanos')?.valueChanges.subscribe((checked: boolean) => {
      const control = patientGroup.get('tetanos_description');
      if (checked) control?.enable();
      else control?.disable();
    });

    patientGroup.get('hepatitis_a')?.valueChanges.subscribe((checked: boolean) => {
      const control = patientGroup.get('hepatitis_a_description');
      if (checked) control?.enable();
      else control?.disable();
    });

    patientGroup.get('hepatitis_b')?.valueChanges.subscribe((checked: boolean) => {
      const control = patientGroup.get('hepatitis_b_description');
      if (checked) control?.enable();
      else control?.disable();
    });

    this.patientsArray.push(patientGroup);
  }

  removePatient(index: number): void {
    this.patientsArray.removeAt(index);
  }

  submit(): void {
    this.trySend = true;

    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos correctamente', 'error');
      return;
    }

    const alarmData: Alarms = {
      client_id: this.clientId,
      subject: this.form.value.subject,
      content: this.form.value.content,
      date: this.form.value.date,
      servidor: this.form.value.servidor
    };

    this.alarmServices.create(alarmData).subscribe({
      next: (createdAlarm) => {
        console.log('recordatorio creado:', createdAlarm);

        this.patientsArray.controls.forEach((group) => {
          const patientGroup = group as FormGroup;

          const patientData: Patients = {
            alarma_id: createdAlarm.id,
            name: patientGroup.value.name,
            cedula: patientGroup.value.cedula,
            age: patientGroup.value.age,
            tetanos: patientGroup.value.tetanos,
            hepatitis_a: patientGroup.value.hepatitis_a,
            hepatitis_b: patientGroup.value.hepatitis_b,
            tetanos_description: patientGroup.value.tetanos_description,
            hepatitis_a_description: patientGroup.value.hepatitis_a_description,
            hepatitis_b_description: patientGroup.value.hepatitis_b_description
          };

          this.patientService.create(patientData).subscribe({
            next: (createdPatient) => {
              console.log('paciente creado:', createdPatient);
            },
            error: (err) => {
              console.error('Error al crear el paciente:', err);
            }
          });
        });

        Swal.fire('Éxito', 'El recordatorio ha sido creado correctamente', 'success');
        this.router.navigate(['/alarmas/admin-list']);
      },
      error: (err) => {
        console.error('Error al crear el recordatorio:', err);
        Swal.fire('Error', 'No se pudo crear el recordatorio', 'error');
      }
    });
  }
}
