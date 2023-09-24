import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { Specialization } from 'src/app/models/specialization';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { SpecializationService } from 'src/app/services/specialization/specialization.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-view-specialization',
  templateUrl: './view-specialization.component.html',
  styleUrls: ['./view-specialization.component.scss']
})
export class ViewSpecializationComponent implements OnInit {


  public id: any;
  public specializationModel = new Specialization();

  constructor(private dialogRef: MatDialogRef<ViewSpecializationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private specializationService: SpecializationService,
    public toastService: ToastServiceService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this._prepare();
  }


  _prepare() {
    this.specializationModel.id = this.data;
    this.findById();
  }

  findById() {
    this.specializationService.get(this.specializationModel).subscribe(
      (user: any) => {
        this.specializationModel = user.data;
      }, error => {
        this.spinner.hide();
        if (error.status === 401) {
          this.handleUnauthorizedError();
        } else {

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
