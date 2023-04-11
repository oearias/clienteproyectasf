import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PathService } from 'src/app/services/path.service';

@Component({
  selector: 'app-semana-masiva',
  templateUrl: './semana-masiva.component.html',
  styleUrls: ['./semana-masiva.component.css']
})
export class SemanaMasivaComponent implements OnInit {

  semanasMasivasForm = this.fb.group({
    semanas: this.fb.array([])
  });

  constructor(
    private pathService: PathService,
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.semanasMasivasForm.setValue({
      semanas: []
    })
  }

  ngOnInit(): void {

    this.setPath();
  }

  addSemana(){

    const semanaFormGroup = this.fb.group({
      fecha_inicio: new FormControl(null, [Validators.required]),
      fecha_fin: new FormControl(null, [Validators.required]),
      weekyear: new FormControl(null, [Validators.required]),
    });

    this.semanas.push(semanaFormGroup);
  }

  saveSemana(){
    
  }

  removeSemana(indice: number){
    this.semanas.removeAt(indice);
  }

  volver() {
    this.router.navigate(['/catalogos/semanas']);
  }

  setPath() {
    this.pathService.path = '/catalogos/semanas';
  }

  get semanas(): FormArray{
    return this.semanasMasivasForm.get('semanas') as FormArray;
  }

}
