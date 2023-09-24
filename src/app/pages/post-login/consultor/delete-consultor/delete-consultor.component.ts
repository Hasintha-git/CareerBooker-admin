import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Appoinment } from 'src/app/models/appoinment';
import { Consultor } from 'src/app/models/consultor';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ConsultorService } from 'src/app/services/consultor/consultor.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-delete-consultor',
  templateUrl: './delete-consultor.component.html',
  styleUrls: ['./delete-consultor.component.scss']
})
export class DeleteConsultorComponent implements OnInit {

 
  public id: any;
  public consultorModel = new Consultor();

  constructor(private dialogRef: MatDialogRef<DeleteConsultorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private consultorService: ConsultorService,
    public toastService: ToastServiceService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.consultorModel.id = this.data;
    this.id = this.data;
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  onSubmit() {
    this.consultorService.deleteUser(this.id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.dialogRef.close();
      },
      error => {
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

  closeDialog() {
    this.dialogRef.close();
  }

}