import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {


  public id: any;
  public userModel = new User();
  public branchList: SimpleBase[];

  constructor(private dialogRef: MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    public toastService: ToastServiceService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this._prepare();
  }


  _prepare() {
    this.userModel.id = this.data;
    this.findById();
  }

  findById() {
    this.userService.get(this.userModel).subscribe(
      (user: any) => {
        this.userModel = user.data;
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
