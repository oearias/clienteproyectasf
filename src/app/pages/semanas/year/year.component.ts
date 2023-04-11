import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PathService } from '../../../services/path.service';
import { SemanasService } from '../../../services/semanas.service';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.css']
})
export class YearComponent implements OnInit {

  yearForm = this.fb.group({
    fecha_inicio: new FormControl(null, Validators.required),
    num_semanas: new FormControl(null, Validators.required),
    year: new FormControl(null, Validators.required),
  });


  constructor(
    private pathService: PathService,
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private semanaService: SemanasService,
    private toastr: ToastrService,
  ) {
    this.yearForm.setValue({
      fecha_inicio: null,
      num_semanas: null,
      year: null,
    });
  }

  ngOnInit(): void {
    this.setPath();
  }

  saveYear() {
    if (this.yearForm.valid) {



      this.semanaService.insertYear(this.yearForm.value).subscribe((res: any) => {

        this.toastr.success(res);

      }, (err) => {

        console.log(err);

        if(err.error.errors[0]){
          this.toastr.error(err.error.errors[0]['param']);
        }else{
          this.toastr.error(err.error);
        }

      });


      this.router.navigateByUrl('/catalogos/semanas');

    }
  }

  onChangeFecha(fecha:Date){
    console.log(fecha);
  }

  volver() {
    this.router.navigate(['/catalogos/semanas']);
  }

  setPath() {
    this.pathService.path = '/catalogos/semanas';
  }


}
