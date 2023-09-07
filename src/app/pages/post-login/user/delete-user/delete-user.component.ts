import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { User } from 'src/app/models/user';
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
    public toastService: ToastServiceService) {
  }

  ngOnInit(): void {
    this.userModel.id = this.data;
    this.id = this.data;
  }


  onSubmit() {
    this.userService.deleteUser(this.userModel).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.dialogRef.close();
      },
      error => {
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

}