import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { PayService } from '../../services/pay.service';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  handler: any;
  Paydata: any;
  isPriceInfoOpen = false;
  isDurationInfoOpen = false;
  isTypeInfoOpen = false;
  isModalOpen: boolean = false;

  email_client:string;
  cliente_id:number;
  role:string;
  name:string;
  session = JSON.parse(sessionStorage.getItem('sesion'));  // Usamos sessionStorage para la sesión
  public datasets: any;
  public data: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  isPaid: boolean = false; // Inicialmente asumimos que no ha pagado
  theFormGroup: any;
  trySend: boolean;
  ref:string;

  constructor(
    private router: Router,
    private service: ClientsService,
    private payServices: PayService
  ) {}

  // Abrir modal
  openModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }


  // Cerrar modal
  closeModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }




  toggleInfo(section: string): void {
    if (section === 'price') {
      this.isPriceInfoOpen = !this.isPriceInfoOpen;
    }
    if (section === 'duration') {
      this.isDurationInfoOpen = !this.isDurationInfoOpen;
    }
    if (section === 'tipo') {
      this.isTypeInfoOpen = !this.isTypeInfoOpen;
    }
  }
  ngOnInit(): void{
    this.guardarid();
    this.initializeEpaycoButton();


  }
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





  // Esta función se llamaría cuando recibas la respuesta de ePayco con ref_payco
  module(courseType: string): void {


    if (this.cliente_id) {
      this.router.navigate([`courses/list`], { queryParams: { type: courseType  } } );
      this.closeModal(); // Cerrar el modal después de la selección

    } else{
      this.router.navigate([`login`]);

    }
  }






  guardarid() {
    const token = sessionStorage.getItem('sesion') ? JSON.parse(sessionStorage.getItem('sesion')).token : null;
  
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.email_client = decodedToken.email;
      this.name = decodedToken.name;
      this.role = decodedToken?.role?.name;
      
      if (this.email_client) {
        this.service.list().subscribe(data => {
          const cliente = data['data'];
          cliente.password = ''; 
          const ClienteEncontrado = cliente.find(cliente => cliente.email === this.email_client);
          if (ClienteEncontrado) {
            this.email_client = this.email_client;
            this.cliente_id = ClienteEncontrado.id;

            // Verificar si el cliente ha pagado
            this.service.checkIfClientPaid({ id: this.cliente_id }).subscribe(
              (response) => {
                this.isPaid = response.hasAccepted; // Actualizamos el estado
              },
              (error) => {
                console.error('Error al verificar el pago:', error);
              }
            );
          } else {
            sessionStorage.removeItem('sesion');
          }
        });
      } else {
        console.error('No hay email almacenado en el token');
      }
    } else {
      console.error('No existe una sesión');
    }
  }
  







  // Función que decodifica el token JWT manualmente
  decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = parts[1];  // El payload es la segunda parte
    const decoded = atob(payload);  // Decodificamos de base64
    return JSON.parse(decoded);  // Retornamos el payload como un objeto
  }

    gotopayment(ref:string){
      this.router.navigate([`validation`], { queryParams: { ref_payco: ref } });
    }

  

}
