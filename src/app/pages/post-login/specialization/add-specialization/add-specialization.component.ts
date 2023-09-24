import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { StorageService } from 'src/app/models/StorageService';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { Specialization } from 'src/app/models/specialization';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { NicValidationConfigService } from 'src/app/services/nic-validation/nic-validation-condig.service';
import { SpecializationService } from 'src/app/services/specialization/specialization.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-specialization',
  templateUrl: './add-specialization.component.html',
  styleUrls: ['./add-specialization.component.scss']
})
export class AddSpecializationComponent implements OnInit {

  speAdd: FormGroup;
  speModelAdd = new Specialization();
  public statusList: SimpleBase[];
  maxDate = new Date();

  constructor(
    private specializationService: SpecializationService,
    public dialogRef: MatDialogRef<AddSpecializationComponent>,
    private formBuilder: FormBuilder,
    public toastService: ToastServiceService,
    private spinner: NgxSpinnerService,
    private sessionStorage: StorageService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this._prepare();
  }

  _prepare() {
    this.initialValidator();
    const user=this.sessionStorage.getItem("user");
    this.speModelAdd.activeUserName = user.user.username;
  }

  initialValidator() {
    this.speAdd = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required
      ]),
      status: this.formBuilder.control('', [
        Validators.required
      ]),
    });

  }




  mandatoryValidation(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);
        }
        control.markAsTouched();
      }
    }
  }

  resetAdd() {
    this.speAdd.reset();
  }

  onSubmit() {
    this.spinner.show();
    if (this.speAdd.valid) {
      this.specializationService.add(this.speModelAdd).subscribe(
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
  
            this.toastService.errorMessage(error.error['errorDescription']);
          }
        }
      );
    } else {
      this.spinner.hide();
      this.mandatoryValidation(this.speAdd)
    }
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  get name() {
    return this.speAdd.get('name');
  }

  get status() {
    return this.speAdd.get('status');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

