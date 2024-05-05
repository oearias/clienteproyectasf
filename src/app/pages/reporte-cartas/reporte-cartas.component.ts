import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { PathService } from '../../services/path.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Semana } from 'src/app/interfaces/Semana';
import { SemanasService } from 'src/app/services/semanas.service';
import { CreditosService } from 'src/app/services/creditos.service';
import { ZonasService } from '../../services/zonas.service';
import { Zona } from 'src/app/interfaces/Zona';
import { AgenciasService } from 'src/app/services/agencias.service';
import { Agencia } from 'src/app/interfaces/Agencia';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-reporte-cartas',
  templateUrl: './reporte-cartas.component.html',
  styleUrls: ['./reporte-cartas.component.css']
})
export class ReporteCartasComponent implements OnInit {

  @ViewChild('selectAgencia') selectAgencia: NgSelectComponent;

  semanas: Semana[] = [];
  zonas: Zona[] = [];
  agenciasArray: Agencia[] = [];
  agencias: Agencia[] = [];
  semanaOpened: Semana;

  reportes = [
    {id:1, name:'Reporte de Cartas'},
    {id:2, name: 'Débito de Agencias'}
  ]

  reporteForm = this.fb.group({
    report_id: new FormControl(null, Validators.required),
    weekyear: new FormControl(null, Validators.required),
    id: new FormControl(null, Validators.required),
    zona_id: new FormControl(null),
    agencia_id: new FormControl(null),
  })

  constructor(
    private pathService: PathService,
    private fb: FormBuilder,
    private semanaService: SemanasService,
    private zonaService: ZonasService,
    private agenciaService: AgenciasService,
    private creditoService: CreditosService,
    private toastr: ToastrService
  ) {
    this.reporteForm.setValue({
      report_id: null,
      weekyear: null,
      id: null,
      zona_id: null,
      agencia_id: null
    })
  }

  ngOnInit(): void {

    this.weekyear.disable();

    this.setPath();
    this.loadData();
  }

  setPath() {
    this.pathService.path = '/dashboard/';
  }

  loadData() {

    this.semanaService.getSemanaOpened().subscribe(semana => {

      this.weekyear.setValue(semana.weekyear);
      this.id.setValue(semana.id);

    });

    this.zonaService.getZonas().subscribe(zonas => {

      this.zonas = zonas;

    });

    this.agenciaService.getAgencias().subscribe(agencias => {

      this.agenciasArray = agencias;

    });

  }

  printWeek() {

    //
    if(this.reporteForm.valid){

      //Reporte Cartas
      if(this.report_id.value == 1){

        this.creditoService.downloadReporteCartasPDF(this.reporteForm.value);
      
      }else{

        //Mandamos a hablar el otro reporte de Debito Agencias

        //Tenemos que validar que mínimo esté seleccionada la Zona
        if(this.zona.value == null){

          this.showAlert();
          
          return 
        }

        this.creditoService.downloadReporteDebitoAgenciasPDF(this.reporteForm.value);

      }


    }


  }

  printWeekXLS() {

    if (this.id.value != null) {

      //Reporte Cartas
      if(this.report_id.value == 1){

        this.creditoService.downloadReporteCartasXLS(this.reporteForm.value);

      }else{

        //Mandamos a hablar el otro reporte de Debito Agencias

        //Tenemos que validar que mínimo esté seleccionada la Zona
        if(this.zona.value == null){

          this.showAlert();
          
          return 
        }

        this.creditoService.downloadReporteDebitoAgenciasXLS(this.reporteForm.value);

      }


    }

  }

  onChangeZona(event: any) {


    if (event?.id) {

      this.agencias = Array.from(this.agenciasArray).filter(agencia =>
        agencia.zona_id == event.id
      )

      if (this.agencias.length == 0) {

        this.selectAgencia.clearModel();

      }

    }else{
      this.selectAgencia.clearModel();
    }
  }

  onClearZona(){
    this.agencias = []; 
  }

  onChangeReportType(event:any){

  }

  onClearAgencia(){
    this.agencias = []
  }

  showAlert(){

    Swal.fire({
      title: 'Llenemos algunos datos',
      html: `Para poder imprimir este reporte es necesario seleccionar una Zona.`,
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#2f5ade',
      confirmButtonText: '¡Entendido!'
    });
  }

  get report_id(){
    return this.reporteForm.get('report_id');
  }

  get weekyear() {
    return this.reporteForm.get('weekyear');
  }
  get id() {
    return this.reporteForm.get('id');
  }

  get zona() {
    return this.reporteForm.get('zona_id');
  }

  get agencia() {
    return this.reporteForm.get('agencia_id');
  }

}
