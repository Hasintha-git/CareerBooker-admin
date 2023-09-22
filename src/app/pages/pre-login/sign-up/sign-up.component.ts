import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/models/response/user-response';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpModel = new User();
  userForm1: FormGroup;
  userForm2: FormGroup;
  userForm3: FormGroup;
  hide = true;
  isNext: string;


  constructor(
    private toastr: ToastServiceService,
    private spinner: NgxSpinnerService,
    private routerLink: Router, 
    private formBuilder: FormBuilder,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.isNext = '1';
    this.initialValidator()
  }
  initialValidator() {
  this.userForm1 = this.formBuilder.group({
    username : this.formBuilder.control('', [Validators.required]),
    fullName : this.formBuilder.control('', [Validators.required]),
    nic : this.formBuilder.control('', [Validators.required]),
    dateOfBirth : this.formBuilder.control('', [Validators.required])
  });

  this.userForm2 = this.formBuilder.group({
    email : this.formBuilder.control('', [Validators.required]),
    mobileNo : this.formBuilder.control('', [Validators.required]),
    address : this.formBuilder.control('', [Validators.required]),
    city : this.formBuilder.control('', [Validators.required]),
  });

  this.userForm3 = this.formBuilder.group({
    password : this.formBuilder.control('', [Validators.required]),
    confirmPassword : this.formBuilder.control('', [Validators.required])
  });
  }

  firstTab() {
    // if (this.userForm1.valid) {
      this.isNext = '1';
    // }else {
    //   this.spinner.hide();
    //   this.toastr.errorMessage('Please fill in all required fields');
    //   this.mandatoryValidation(this.userForm1)
    // }
  }

  secondTab() {
    if (this.userForm1.valid) {
      this.isNext = '2';
    }else {
      this.spinner.hide();
      this.toastr.errorMessage('Please fill in all required fields');
      this.mandatoryValidation(this.userForm1)
    }
  }

  threeTab() {
    if (this.userForm2.valid) {
      this.isNext = '3';
    }else {
      this.spinner.hide();
      this.toastr.errorMessage('Please fill in all required fields');
      this.mandatoryValidation(this.userForm2)
    }
  }

  login() {
    this.routerLink.navigateByUrl('/login')
  }

  onSubmit() {
    this.spinner.show();
    if (this.userForm3.valid) {
      this.userService.userRegister(this.signUpModel).subscribe((userResponse: any)=> {
        this.toastr.successMessage(userResponse.msg);
        // this.routerLink.navigateByUrl('/login')
        this.userForm3.reset();
        Object.keys(this.userForm3.controls).forEach(key => {
          const control = this.userForm3.controls[key];
          control.clearValidators();
          control.updateValueAndValidity();
        });
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.errorMessage(error);
      })
    } else {
      this.spinner.hide();
      this.toastr.errorMessage('Please fill in all required fields');
      this.mandatoryValidation(this.userForm3)
    }
  }

  mandatoryValidation(formGroup: FormGroup) {
    // this.isEmptyThumbnail = false;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl> formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup> formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);

        }
        control.markAsTouched();
      }
    }
  }

  get username() {
    return this.userForm1.get('username');
  }

  get fullName() {
    return this.userForm1.get('fullName');
  }

  get nic() {
    return this.userForm1.get('nic');
  }

  get dateOfBirth() {
    return this.userForm1.get('dateOfBirth');
  }

  get city() {
    return this.userForm2.get('city');
  }
  get address() {
    return this.userForm2.get('address');
  }
  get email() {
    return this.userForm2.get('email');
  }
  get mobileNo() {
    return this.userForm2.get('mobileNo');
  }

  get password() {
    return this.userForm3.get('password');
  } 
}
