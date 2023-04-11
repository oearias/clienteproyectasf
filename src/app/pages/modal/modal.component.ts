import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(
    public modalService: ModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  deleteRegistro(){
    this.modalService.deleteRegistro().subscribe( res => {
      
      this.modalService.showModal = false;

      this.toastr.success(res);

    });
  }

}
