import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlarmService } from '../../../services/alarm.service';
import { Alarms } from '../../../models/alarms.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  alarmas: Alarms[];

  private service = inject(AlarmService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      this.alarmas = data["data"];
    });
  }

  goToCreate(): void {
    this.router.navigate(['/alarmas/admin-create']);
  }

  formatDateOnly(date: string): string {
    return new Date(date).toISOString().slice(0, 10);
  }

  isNear(dateStr: string): boolean {
    const today = new Date();
    const target = new Date(dateStr);
    const diffInMs = target.getTime() - today.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays < 5;
  }

  viewAlarm(id: number) {
    this.router.navigate([`pacientes/list`], { queryParams: { id: id } });
  }
}
