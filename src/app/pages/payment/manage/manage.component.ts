import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { ClientsService } from '../../../services/clients.service';
import { PayService } from '../../../services/pay.service';


@Component({
  selector: 'app-manage',

  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit{
  paymentStatus: string; // Mensaje para mostrar en el HTML
  refPayco: string ; // Referencia del pago
  paymentType: string ; // Referencia del pago
  paymentQuotas: number ;
  paymentEmail: string ;
  paymentAmount: number ;
  paymentProduct:string;
  clientId:number;
  clientName:string;
  email:string;


  route=inject(ActivatedRoute)
  clientService=inject(ClientsService)
  payServices=inject(PayService)

  ngOnInit(): void {
    // Obtener el ref_payco de la URL


    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
    
    if (token) {
      // Si hay un token, decodificarlo para extraer la información del usuario
      const decodedToken = this.decodeToken(token);
      this.email = decodedToken.email; // Asigna el nombre del usuario desde el token
    }

    this.route.queryParams.subscribe(params => {
      this.refPayco = params['ref_payco'];
      if (this.refPayco) {
        this.validatePaymentStatus(this.refPayco);
      } else {
        this.paymentStatus = 'No se recibió una referencia de pago.';
      }
    });
  }

  // Validar el estado del pago usando la API de ePayco
  async validatePaymentStatus(refPayco: string): Promise<void> {

      axios.get(`https://secure.epayco.co/validation/v1/reference/${refPayco}`)
      .then(response => {
        const paymentStatus = response.data.data.x_response; // Estado de la transacción
        this.paymentStatus = response.data.data.x_response;
        this.paymentEmail = response.data.data.x_customer_email
        this.paymentQuotas = response.data.data.x_quotas
        this.paymentAmount = response.data.data.x_amount
        this.paymentProduct = response.data.data.x_description
        this.clientService.buscarPorEmail(this.email).subscribe({
          next: client => {
            this.clientId = client.id; // Guarda el ID del cliente
            this.clientName = client.name; // Guarda el ID del cliente

      
            // Mueve la creación de newPayment aquí
            const newPayment = {
              email: this.paymentEmail,
              amount: this.paymentAmount,
              state: this.paymentStatus,
              client_id: this.clientId, // Ahora estará definido
              name: this.clientName, // Ahora estará definido
              product:this.paymentProduct,
              ref:this.refPayco,
            };
            this.payServices.Create(newPayment).subscribe()

          }
        })
        if (paymentStatus === "Aceptada") {
          this.paymentStatus = "Pago Aceptado";
        } else if (paymentStatus === "Rechazada") {
          this.paymentStatus = "Pago rechazado";

        } else if (paymentStatus === "Pendiente") {
          this.paymentStatus = "Pago pendiente";

        } else {
          this.paymentStatus = "Estado desconocido. Por favor, contacta al soporte.";
        }


      
      })
    
    .catch(error => {
        console.error('Error al validar el pago:', error);
        this.paymentStatus = "Error al validar el pago. Por favor, contacta al soporte.";
      });
    }



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decodeToken(token: string): any {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token inválido');
      }
  
      const payload = parts[1];  // El payload es la segunda parte
      const decoded = atob(payload);  // Decodificamos de base64
      return JSON.parse(decoded);  // Retornamos el payload como un objeto
    }
}
