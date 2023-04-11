import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  public isLoading$ = this.spinnerService.isLoading$

  constructor(
    public spinnerService: SpinnerService
  ) { }

}


