import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Consultor } from 'src/app/models/consultor';
import { AuthService } from 'src/app/services/AuthService';
import { ConsultorService } from 'src/app/services/consultor/consultor.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-view-consultor',
  templateUrl: './view-consultor.component.html',
  styleUrls: ['./view-consultor.component.scss']
})
export class ViewConsultorComponent implements OnInit {


  public id: any;
  public consultorModel = new Consultor();

  constructor(private dialogRef: MatDialogRef<ViewConsultorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private consultorService: ConsultorService,
    public toastService: ToastServiceService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.consultorModel.con_id = this.data;
    this.findById();
  }

  findById() {
    this.consultorService.get(this.consultorModel).subscribe(
      (consultor: any) => {
        this.consultorModel = consultor.data;
      },  error => {
        this.spinner.hide();
        if (error.status === 401) {
          this.handleUnauthorizedError();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastService.errorMessage(error.error['errorDescription']);
        }
      }
    );
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
