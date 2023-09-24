import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/models/StorageService';
import { Appoinment } from 'src/app/models/appoinment';
import { AuthService } from 'src/app/services/AuthService';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.scss']
})
export class ViewAppointmentComponent implements OnInit {


  public id: any;
  public appoinmentModel = new Appoinment();

  constructor(private dialogRef: MatDialogRef<ViewAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appoinmentService: AppointmentService,
    public toastService: ToastServiceService,
    private sessionStorage: StorageService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,) {
  }

  ngOnInit(): void {
    this.appoinmentModel.appointmentId = this.data;
    this.findById();
  }

  findById() {
    this.spinner.show();
    this.appoinmentService.get(this.appoinmentModel).subscribe(
      (appointment: any) => {
        this.appoinmentModel = appointment.data;
        this.spinner.hide();
      },error => {
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
