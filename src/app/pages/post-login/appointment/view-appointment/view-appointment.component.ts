import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appoinment } from 'src/app/models/appoinment';
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
    public toastService: ToastServiceService) {
  }

  ngOnInit(): void {
    this.appoinmentModel.appointmentId = this.data;
    this.findById();
  }

  findById() {
    this.appoinmentService.get(this.appoinmentModel).subscribe(
      (appointment: any) => {
        console.log(">", appointment.data)
        this.appoinmentModel = appointment.data;
      }, error => {
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
