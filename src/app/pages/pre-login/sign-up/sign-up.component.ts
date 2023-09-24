import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/models/response/user-response';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { NicValidationConfigService } from 'src/app/services/nic-validation/nic-validation-condig.service';

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
    private userService: UserService,
    private nicValidationConfig: NicValidationConfigService,
    ) { }

  ngOnInit(): void {
    this.isNext = '1';
    this.initialValidator()
  }
  initialValidator() {
  this.userForm1 = this.formBuilder.group({
    username : this.formBuilder.control('', [Validators.required]),
    fullName : this.formBuilder.control('', [Validators.required]),
    nic: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(12),
      Validators.pattern(/^([0-9]{9}[X|V|v]|[0-9]{12})$/),
    ]),
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
  }, {
    // Add a custom validator to check if the passwords match
    validator: this.passwordsMatchValidator
  });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
  

    if (password === confirmPassword) {
      return null; // Passwords match, return null (no error)
    } else {
      return { passwordsNotMatch: true }; // Passwords don't match, return an error object
    }
  }
  firstTab() {
      this.isNext = '1';
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
      this.userService.preRegistration(this.signUpModel).subscribe((userResponse: any)=> {
        this.toastr.successMessage(userResponse.responseDescription);
        this.routerLink.navigateByUrl('/login')
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
        this.toastr.errorMessage(error.error['errorDescription']);
      })
    } else {
      this.spinner.hide();
      this.toastr.errorMessage('Please fill in all required fields');
      this.mandatoryValidation(this.userForm3)
    }
  }

  customNicValidator(isValid: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isValid) {
        return null; // Return null if the NIC is valid
      } else {
        return { invalidNic: true }; // Return an error object if the NIC is invalid
      }
    };
  }

  onNicInputChange(event: any) {
    if (this.userForm1.get('nic').valid) {
      const inputValue = event.target.value;
      const dob = this.nicValidationConfig.extractBirthday(inputValue);
      this.signUpModel.dateOfBirth = dob;
    } else {
      this.signUpModel.dateOfBirth = null;
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
