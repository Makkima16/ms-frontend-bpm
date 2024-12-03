import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Records } from '../../models/records.model';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-list',
  templateUrl: './list-r.component.html',
  styleUrls: ['./list-r.component.scss']
})
export class ListRComponent implements OnInit {
  registro: Records[];



  constructor(private service:RegisterService , private router: Router, private activateRoute: ActivatedRoute,) {

  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.service.list().subscribe(data => {
      this.registro = data["data"];
    });
  }





}