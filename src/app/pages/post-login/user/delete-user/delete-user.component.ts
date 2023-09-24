import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {


  public id: any;
  public userModel = new User();

  constructor(private dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    public toastService: ToastServiceService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.userModel.id = this.data;
    this.id = this.data;
  }


  onSubmit() {
    this.spinner.show();
    this.userService.deleteUser(this.id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.dialogRef.close();
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        if (error.status === 401) {
          this.handleUnauthorizedError();
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
    this.spinner.hide();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}