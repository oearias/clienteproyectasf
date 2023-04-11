import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MontosService } from 'src/app/services/montos.service';
import { Monto } from '../../../interfaces/Monto';
import { TarifasService } from '../../../services/tarifas.service';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-monto',
  templateUrl: './monto.component.html',
  styleUrls: ['./monto.component.css']
})
export class MontoComponent implements OnInit {

  tarifas: any = [];

  montoForm = this.fb.group({
    id: new FormControl(null),
    monto: new FormControl(null, Validators.required),
    tarifa_id: new FormControl(null, Validators.required),
  });

  editingMonto: Monto;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private montoService: MontosService,
    private tarifaService: TarifasService
  ) { 
    this.montoForm.setValue({
      id: null,
      monto: null,
      tarifa_id: null,
    });
  }

  ngOnInit(): void {
    
    this.setPath();
    this.getTarifas();

    this.route.params.subscribe((params) => {

      if (params.id) {
        this.montoService.getMonto(params.id).subscribe(res => {

          this.editingMonto = res;

          this.id?.setValue(this.editingMonto.id);
          this.monto?.setValue(this.editingMonto.monto);
          this.tarifa_id?.setValue(this.editingMonto.tarifa_id);

        });

      }
    });

  }

  getTarifas() {
    this.tarifaService.getTarifas().subscribe(res => {
      this.tarifas = res;
    })
  }

  saveMonto() {

    if (this.montoForm.valid) {

      if (this.montoForm.value.id != null) {

        this.montoService.updateMonto(this.montoForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.montoService.insertMonto(this.montoForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/montos');

    }
  }
  
  volver() {
    this.router.navigate(['/catalogos/montos']);
  }

  setPath(){
    this.pathService.path = '/catalogos/montos';
  }

  //Getters
  get id() {
    return this.montoForm.get('id');
  }

  get tarifa_id() {
    return this.montoForm.get('tarifa_id');
  }

  get monto() {
    return this.montoForm.get('monto');
  }

}
