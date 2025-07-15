import { Component, inject, OnInit } from '@angular/core';
import { PayService } from '../../../services/pay.service';
import { Payments } from '../../../models/payments.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list',

  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
  payments: Payments[] = [];


  service=inject(PayService)
  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      if (data && data["data"]) {
        // Decodifica cualquier texto mal codificado
        this.payments = data["data"].map((payment: Payments) => ({
          ...payment,
          name: payment.name,
          email: payment.email,
          product: payment.product,
          state: payment.state,
          ref: payment.ref,
        }));
      }
    });
  }

  decodeText(text: string | null | undefined): string {
    return text ? decodeURIComponent(escape(text)) : '';
  }
  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  confirmValidation(payment: Payments) {
  Swal.fire({
    title: '¿Validar pago?',
    text: 'Esto cambiará el estado a "Aceptada".',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, validar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedPayment = { ...payment, state: 'Aceptada' };
      this.service.update(updatedPayment).subscribe(() => {
        Swal.fire('Validado', 'El pago ha sido aceptado.', 'success');
        this.list(); // recargar
      });
    }
  });
}

confirmDelete(payment: Payments) {
  Swal.fire({
    title: '¿Eliminar pago?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'error',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.delete(payment.id!).subscribe(() => {
        Swal.fire('Eliminado', 'El pago fue eliminado.', 'success');
        this.list();
      });
    }
  });
}

}
