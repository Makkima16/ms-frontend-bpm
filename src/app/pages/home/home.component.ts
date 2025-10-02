import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientsService } from '../../services/clients.service';
import { CourseService } from '../../services/course.service';
import { PayService } from '../../services/pay.service';
import { Payments } from '../../models/payments.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

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
  isLoading = true;
  handler: any;
  Paydata: any;
  
  email_client = '';
  cliente_id: number;
  role = '';
  name = '';
  isLoggedIn : boolean;
  isPaid : boolean;
  paymentReference = '';
  notificationMessage = '';
  exist_paid:boolean

  router=inject(Router)
  snackBar=inject(MatSnackBar)
  service=inject(ClientsService)
  courseService=inject(CourseService)
  payService=inject(PayService)
  http=inject(HttpClient)
  ngOnInit(): void {
    this.decodeAndSetSessionData();
    this.pingDatabase();
    this.initializeEpaycoButton();


  }
  private pingDatabase(): void {
    this.http.get('https://ms-negocio-bpm-production.up.railway.app/modulos').subscribe({
      next: () => console.log('Servidor despierto'),
      error: () => console.log('Servidor aún dormido...')
    });
  }

  private decodeAndSetSessionData(): void {
  const session = sessionStorage.getItem('sesion');
  if (!session) {
    this.isLoading = false;
    return;
  }

  const token = JSON.parse(session).token;
  if (!token) {
    this.isLoading = false;
    return;
  }

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

        let completed = 0;
        const finishIfReady = () => {
          completed++;
          if (completed === 2) this.isLoading = false;
        };

        this.service.checkIfClientPaid({ id: this.cliente_id }).subscribe(res => {
          this.isPaid = res.hasAccepted;
          finishIfReady();
        });

        this.service.checkIfPaidExist({ id: this.cliente_id }).subscribe(res => {
          this.exist_paid = res.hasAccepted;
          finishIfReady();
        });
      } else {
        sessionStorage.removeItem('sesion');
        this.isLoading = false;
      }
    }, () => this.isLoading = false);
  } else {
    this.isLoading = false;
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
//función que al momento de inicializar el boton cargara los datos necesarios para el pago por epayco
  initializeEpaycoButton(): void {
    if ((window as any).ePayco) {
      this.handler = (window as any).ePayco.checkout.configure({
        key: environment.epayco_public_key,
        test: true,
      });
      const invoiceNumber = uuidv4();
      // Configuración del pago
      this.Paydata = {
        name: 'Curso Manipulación De alimentos',
        description: 'Curso Manipulación De alimentos',
        invoice: invoiceNumber,
        currency: 'cop',
        amount: '20000',
        tax_base: '20000',
        tax: '',
        tax_ico: '0',
        country: 'co',
        lang: 'es',
        external: true,
        name_billing: '',
        address_billing: '',
        type_doc_billing: 'cc',
        mobilephone_billing: '',
        number_doc_billing: '',
        email_billing: this.email_client,
        extra1: this.cliente_id // Asegúrate de que se almacene como string en el pago
      };
    } else {
      console.error('ePayco script no cargó correctamente');
    }
  }
  // funcion que se encarga de ejecutar la pasarela de pagos de epayco
  pay(): void {
    if(this.cliente_id==undefined){
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Primero Logueese por favor',
        allowOutsideClick: false
      });

    }else{
      // Llamamos al método checkIfClientPaid para verificar si el cliente ha realizado el pago
      this.service.checkIfClientPaid({ id: this.cliente_id }).subscribe(
        (response) => {
          // Si el cliente ha realizado el pago (hasAccepted es true)
          if (response.hasAccepted) {
            // Si ya pagó, mostramos un mensaje de error y no dejamos continuar
            Swal.fire({
              icon: 'error',
              title: 'Acceso denegado',
              text: 'Usted ya ha realizado el pago, si tiene alguna duda o problema contactese con nuestro soporte',
              allowOutsideClick: false
            });
          } else {
            // Si no ha pagado, abrimos el formulario de pago
            if (this.handler) {
              this.handler.open(this.Paydata);
            } else {
              console.error('ePayco handler no está configurado');
            }
          }

        },
        (error) => {
          // Manejo de errores en caso de que la solicitud falle
          console.error('Error al verificar el pago:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar el pago. Inténtelo nuevamente.',
            allowOutsideClick: false
          });
        }
      );
    }
  }

}
