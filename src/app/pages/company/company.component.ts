import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css',
})
export class CompanyComponent {
  formData: Company = {
    name: '',
    business:'',
    email: '',
    tel: undefined,
    collabs: undefined,
  };

  companyService = inject(CompanyService)
  router = inject(Router);

  onSubmit() {
    this.companyService.create(this.formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Enviado!',
          text: 'Tu solicitud fue enviada con éxito. Nos pondremos en contacto pronto.',
          confirmButtonColor: '#2C2566'
        }).then(() => {
          this.router.navigate(['/']); // <--- Redirigir después de cerrar SweetAlert
        });

        this.formData = {
          name: '',
          email: '',
          business:'',
          tel: '',
          collabs: undefined,
        };
      },
      error: (err) => {
        console.error('Error al enviar solicitud:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al enviar tu solicitud. Intenta nuevamente.',
        });
      }
    });
  }
}
