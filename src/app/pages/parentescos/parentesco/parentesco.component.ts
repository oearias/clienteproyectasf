import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ParentescosService } from 'src/app/services/parentescos.service';
import { Parentesco } from '../../../interfaces/Parentesco';
import { PathService } from '../../../services/path.service';

@Component({
  selector: 'app-parentesco',
  templateUrl: './parentesco.component.html',
  styleUrls: ['./parentesco.component.css']
})
export class ParentescoComponent implements OnInit {

  parentescoForm = this.fb.group({
    id: new FormControl(null),
    nombre: new FormControl(null, Validators.required),
  });

  editingParentesco: Parentesco;

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private parentescoService: ParentescosService,
  ) { 
    this.parentescoForm.setValue({
      id: null,
      nombre: null,
    });
  }

  ngOnInit(): void {

    this.setPath();
    
    this.route.params.subscribe((params) => {

      if (params.id) {
        this.parentescoService.getParentesco(params.id).subscribe(res => {
          
          this.editingParentesco = res;

          this.id?.setValue(this.editingParentesco.id);
          this.nombre?.setValue(this.editingParentesco.nombre);
        });

      }
    });
  }

  saveParentesco() {

    if (this.parentescoForm.valid) {

      if (this.parentescoForm.value.id != null) {

        this.parentescoService.updateParentesco(this.parentescoForm.value).subscribe((res: any) => {

          this.toastr.success(res);

        });
      } else {

        this.parentescoService.insertParentesco(this.parentescoForm.value).subscribe((res: any) => {

          this.toastr.success(res);
        }, (err) => {

          this.toastr.error(err.error);

        });
      }

      this.router.navigateByUrl('/catalogos/parentescos');

    }
  }

  volver() {
    this.router.navigate(['/catalogos/parentescos']);
  }

  setPath(){
    this.pathService.path = '/catalogos/parentescos';
  }

  //Getters
  get id() {
    return this.parentescoForm.get('id');
  }

  get nombre() {
    return this.parentescoForm.get('nombre');
  }

}
