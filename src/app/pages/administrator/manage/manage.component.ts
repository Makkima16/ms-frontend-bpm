/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { ClientsService } from '../../../services/clients.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Color, ScaleType  } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  email_client = '';
  name = '';
  role = '';
  isLoggedIn = false;
  loading = true; // Bloquea renderizado mientras se verifica
  showError = false;
  cliente_id: number;
  dashboardData: any = null;
  chartData: any[] = [];
  chartDataPersonas: any[] = [];
  toggleSidebar = false;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#6366F1', '#10B981']
  };

  service = inject(ClientsService);
  router = inject(Router);
  dashboardService = inject(AdminService);



  ngOnInit(): void {
    this.decodeAndSetSessionData();
    
    this.dashboardService.getSummary().subscribe(data=>{
      this.dashboardData = data;
      this.loadGraphs();

    })
  }

  private decodeAndSetSessionData(): void {
    const session = sessionStorage.getItem('sesion');
    if (!session) {
      this.denyAccess();
      return;
    }

    const token = JSON.parse(session).token;
    if (!token) {
      this.denyAccess();
      return;
    }

    const decoded = this.decodeToken(token);
    this.email_client = decoded.email;
    this.name = decoded.name;
    this.role = decoded?.role?.name;
    this.isLoggedIn = !!this.email_client;

    if (this.role !== 'Administrador') {
      this.denyAccess();
      return;
    }

    if (this.isLoggedIn) {
      this.service.list().subscribe(data => {
        const clientes = data['data'];
        const found = clientes.find(c => c.email === this.email_client);
        if (found) {
          this.cliente_id = found.id;
        } else {
          sessionStorage.removeItem('sesion');
        }
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  private denyAccess(): void {
    this.showError = true;
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  navigateTo(page: string): void {
    const routesMap: Record<string, string> = {
      'recordatorio': 'alarmas/admin-list',
      'clientes': 'clients/admin-listClients',
      'pagos': 'payments/admin-listPay',
      'examenes': 'examen/admin-list',
      'crear-examen': 'examen/admin-createExamen',
      'cursos': 'courses/admin-list',
      'crear-curso': 'courses/admin-crearCursos',
      'crear-administrador': 'admin/admin-create',

    };

    const path = routesMap[page];
    if (path) {
      this.router.navigate([path]);
    } else {
      console.error('Ruta no encontrada para:', page);
    }
  }
  private loadGraphs(): void {
    if (!this.dashboardData) return;

    const metaRecaudo = 200000; // meta en pesos
    const metaPersonas = 20;    // meta de personas que pagaron

    this.chartData = [
      { name: 'Meta', value: metaRecaudo },
      { name: 'Recaudado', value: this.dashboardData.totalRecaudadoMes }
    ];

    this.chartDataPersonas = [
      { name: 'Meta', value: metaPersonas },
      { name: 'Pagos', value: this.dashboardData.totalPagosMes }
    ];
  }

}
