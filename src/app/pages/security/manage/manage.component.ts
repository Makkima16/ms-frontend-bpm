import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { create } from 'domain';
//import { json } from 'stream/consumers';
import Swal from 'sweetalert2';
import { SecurityService } from '../../../services/security.service';
import { Security } from '../../../models/security.model';
import { Login2Service } from '../../../services/login.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  security: Security;
  theFormGroup: FormGroup;
  trySend: boolean;
  showTokenInput: Boolean = false;
  id : string;
  constructor(private activateRoute: ActivatedRoute,
    private service: Login2Service,
    private theFormBuilder: FormBuilder,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.configFormGroup();
    this.trySend = false;
    this.security = { email: '', password: '', id: ''}

  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      token: ['', [Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

    get getTheFormGroup() {
      return this.theFormGroup.controls
    }

    save() {
      this.trySend = true;
      if (this.theFormGroup.invalid) {
        Swal.fire( "Error", "Formulario inválido", "error");
      }else{
        
        this.service.login(this.theFormGroup.value).subscribe(data=> {
          console.log("First Factor Passed");
          this.showTokenInput = true;
          this.id = data.id;
        })
            
          
        
      }
    }

    secondFactor() {
      this.trySend = true;
        // Crea un objeto con el id y el token para enviarlo en la solicitud
        const requestBody = {
          id: this.id,
          token: this.theFormGroup.value.token
        };

        
        this.service.secondAut(requestBody).subscribe(data => {
          this.showTokenInput = false;
          Swal.fire("Exito", "Usuario autenticado", "success");
          sessionStorage.setItem('token', JSON.parse(JSON.stringify(data)).token);
          this.router.navigateByUrl('/dashboard');

        },
        error => {
          // Manejo de error
          Swal.fire("Error", "Autenticación fallida", "error");
          console.error(error);  // Muestra error en la consola para depuración
        }); 
       
    }
    
}