import { Component, OnInit } from '@angular/core';
import { PayService } from '../../../services/pay.service';
import { Payments } from '../../../models/payments.model';


@Component({
  selector: 'app-list',

  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
  payments: Payments[] = [];

  constructor(private service: PayService) {}

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      if (data && data["data"]) {
        // Decodifica cualquier texto mal codificado
        this.payments = data["data"].map((payment: Payments) => ({
          ...payment,
          name: this.decodeText(payment.name),
          email: this.decodeText(payment.email),
          product: this.decodeText(payment.product),
          state: this.decodeText(payment.state),
          ref: this.decodeText(payment.ref),
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
}
