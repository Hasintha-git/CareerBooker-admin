import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/models/StorageService';
import { Appoinment } from 'src/app/models/appoinment';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-cancel-appointment',
  templateUrl: './cancel-appointment.component.html',
  styleUrls: ['./cancel-appointment.component.scss']
})
export class CancelAppointmentComponent implements OnInit {


  public id: any;
  public appointmentModel = new Appoinment();

  constructor(private dialogRef: MatDialogRef<CancelAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appointmentService: AppointmentService,
    public toastService: ToastServiceService,
    private sessionStorage: StorageService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
    ) {
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }
  ngOnInit(): void {
    this.appointmentModel.appointmentId = this.data;
    this.id = this.data;
  }


  onSubmit() {
    this.spinner.show();
    this.appointmentService.cancelAppointment(this.id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.dialogRef.close();
        this.spinner.hide();
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