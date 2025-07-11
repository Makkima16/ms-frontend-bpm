import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;

  private router = inject(Router);

  ngOnInit() {
    const html = document.getElementsByTagName('html')[0];
    html.classList.add('auth-layout');

    const body = document.getElementsByTagName('body')[0];
    body.classList.add('bg-default');

    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }

  ngOnDestroy() {
    const html = document.getElementsByTagName('html')[0];
    html.classList.remove('auth-layout');

    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('bg-default');
  }
}
