import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientsService } from '../../services/clients.service';
import { CourseService } from '../../services/course.service';
import { PayService } from '../../services/pay.service';
import { Payments } from '../../models/payments.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isPriceInfoOpen = false;
  isDurationInfoOpen = false;
  isTypeInfoOpen = false;
  isModalOpen = false;

  email_client = '';
  cliente_id: number;
  role = '';
  name = '';
  isLoggedIn = false;
  isPaid = false;
  paymentReference = '';
  notificationMessage = '';
  exist_paid=false

  router=inject(Router)
  snackBar=inject(MatSnackBar)
  service=inject(ClientsService)
  courseService=inject(CourseService)
  payService=inject(PayService)
  ngOnInit(): void {
    this.decodeAndSetSessionData();
    this.pingDatabase();


  }

  private pingDatabase(): void {
    this.courseService.list().subscribe({
      next: () => {
        // noop: se usa solo para despertar la base de datos
      },
      error: () => {
        // noop: ignorar errores de wake-up
      }
    });
  }

  private decodeAndSetSessionData(): void {
    const session = sessionStorage.getItem('sesion');
    if (!session) return;

    const token = JSON.parse(session).token;
    if (!token) return;

    const decoded = this.decodeToken(token);
    this.email_client = decoded.email;
    this.name = decoded.name;
    this.role = decoded?.role?.name;
    this.isLoggedIn = !!this.email_client;

    if (this.isLoggedIn) {
      this.service.list().subscribe(data => {
        const clientes = data['data'];
        const found = clientes.find(c => c.email === this.email_client);
        if (found) {
          this.cliente_id = found.id;

          this.service.checkIfClientPaid({ id: this.cliente_id }).subscribe(res => {
            this.isPaid = res.hasAccepted;
          });
          this.service.checkIfPaidExist({id:this.cliente_id}).subscribe(res=>{
            this.exist_paid= res.hasAccepted
          })
        } else {
          sessionStorage.removeItem('sesion');
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  toggleInfo(section: string): void {
    this.isPriceInfoOpen = section === 'price' ? !this.isPriceInfoOpen : this.isPriceInfoOpen;
    this.isDurationInfoOpen = section === 'duration' ? !this.isDurationInfoOpen : this.isDurationInfoOpen;
    this.isTypeInfoOpen = section === 'tipo' ? !this.isTypeInfoOpen : this.isTypeInfoOpen;
  }

  openModal(): void {
    const modal = document.getElementById('courseModal');
    modal?.classList.remove('hidden');
  }

  closeModal(): void {
    const modal = document.getElementById('courseModal');
    modal?.classList.add('hidden');
  }

  module(courseType: string): void {
    if (this.cliente_id) {
      this.router.navigate(['courses/list'], { queryParams: { type: courseType } });
      this.closeModal();
    } else {
      this.router.navigate(['login']);
    }
  }

  gotopayment(ref: string): void {
    this.router.navigate(['validation'], { queryParams: { ref_payco: ref } });
  }

submitReference(): void {
  const ref = this.paymentReference.trim();
  if (!ref) {
    this.showNotification('Por favor, ingresa la referencia del pago.');
    return;
  }

  const payment: Payments = {
    ref: ref,
    client_id: this.cliente_id,
    email: this.email_client,
    name: this.name,
    amount: 20000,
    product: 'Curso Manipulacion de Alimentos'
  };

  this.payService.Create(payment).subscribe({
    next: () => {
      this.showNotification('Gracias. Hemos recibido tu referencia. La validaremos en máximo 24 horas, por favor ten un poco de paciencia');
      this.paymentReference = '';
    },
    error: () => {
      this.showNotification('Ocurrió un error al registrar la referencia. Intenta más tarde.');
    }
  });
}

private showNotification(message: string): void {
  this.notificationMessage = message;
  setTimeout(() => {
    this.notificationMessage = '';
  }, 4000); // desaparecer después de 4 segundos
}
}
