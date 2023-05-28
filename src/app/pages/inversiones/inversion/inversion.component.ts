import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreditosService } from 'src/app/services/creditos.service';
import { PathService } from 'src/app/services/path.service';
import { Credito } from '../../../interfaces/Credito';
import Swal from 'sweetalert2';
import { InversionService } from '../../../services/inversion.service';

@Component({
  selector: 'app-inversion',
  templateUrl: './inversion.component.html',
  styleUrls: ['./inversion.component.css']
})
export class InversionComponent implements OnInit {

  creditos: any[] = [];
  inversion: Credito;

  inversionForm = this.fb.group({
    id: new FormControl(null, Validators.required),
    inversion_positiva: new FormControl(null, Validators.required),
  });

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private creditoService: CreditosService,
    private inversionService: InversionService,
    private toastr: ToastrService,
  ) {
    this.inversionForm.setValue({
      id: null,
      inversion_positiva: null
    });
  }

  ngOnInit(): void {
    this.setPath();
    this.loadData();

    this.route.params.subscribe((params) => {

      if (params.id) {

        this.creditoService.getCredito(params.id).subscribe(res => {

          this.inversion = res;

          this.credito_id?.setValue(this.inversion?.id);


        });

        this.inversionForm.disable();


      }
    });

  }


  saveInversion() {

    if (this.inversionForm.valid) {

      if (this.inversionForm.value.id != null) {

        Swal.fire({
          title: 'Crear inversión positiva',
          html: `¿Está ud. seguro de crear una inversión positiva para este crédito?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#2f5ade',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        }).then((result) => {
          if (result.isConfirmed) {

            this.creditoService.setInversionPositiva(this.inversionForm.getRawValue()).subscribe((res: any) => {

              this.toastr.success(res);

            }, (err) => {

              this.toastr.error(err.error);

            });

            this.router.navigateByUrl('/dashboard/inversiones');


          }
        });





      }



    }
  }

  onChangeCredito(event: any) {

    this.inversion = null;

    if (event) {

      this.creditos.filter((credito: Credito) => credito.id === this.credito_id.value)
    }

  }

  loadData() {
    this.loadCreditos();
  }

  loadCreditos() {

    const fechaHoy = new Date();

    this.creditoService.getCreditos().subscribe(creditos => {

      this.creditos = creditos
        .filter(item => item.entregado === 1)
        .filter(item => item.inversion_positiva != true)
        .filter(item => {
          const fechaInicio = new Date(item.fecha_inicio_real);          
          fechaInicio.setDate(fechaInicio.getDate()+1); //1 dia despues del primer pago
          return fechaHoy <= fechaInicio
        })
        .map((credito) => {
          credito.nombre = `${credito.num_contrato} | ${credito.num_cliente} | ${credito.apellido_paterno} ${credito.apellido_materno} ${credito.nombre}`
          return credito;
        });

    });


  }



  volver() {
    this.router.navigate(['/dashboard/inversiones']);
  }

  setPath() {
    this.pathService.path = '/dashboard/inversiones';
  }

  get credito_id() {
    return this.inversionForm.get('id');
  }

}
