import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService} from 'ngx-toastr';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  token = null;
  public isLoading$ = this.spinnerService.isLoading$

  public loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
  }

  login() {

    if(this.loginForm.valid){

      this.authService.login(this.loginForm.value).subscribe( (res:any) => {

        if(res.msg){
          this.toastr.error(res.msg);
        }
        
        if(res.token){

          sessionStorage.setItem('nombreCompleto', `${res.nombre} ${res.apellido_paterno}`);
          sessionStorage.setItem('role', `${res.role}`);
          sessionStorage.setItem('usuario', `${res.usuario}`);
          
          
          //this.router.navigateByUrl('/dashboard');
          this.router.navigate(['/dashboard', res], {queryParams: {reload:true} });

          //
        }

      }, (err) => {


        if(err){
          this.toastr.error(err.error.msg);
        }
      })

    }else{

      this.toastr.error('Formulario no valido');
    }

    

  }

}
