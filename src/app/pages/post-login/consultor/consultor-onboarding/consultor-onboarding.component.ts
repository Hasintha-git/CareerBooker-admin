import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { User } from 'src/app/models/user';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-consultor-onboarding',
  templateUrl: './consultor-onboarding.component.html',
  styleUrls: ['./consultor-onboarding.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultorOnboardingComponent implements OnInit {
  public statusList: SimpleBase[];
  public specializationList: SimpleBase[];
  public timeSlotList: SimpleBase[];
  public userModel = new User();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable: boolean;

  searchNic:string;
  selectedSlotList:number[];
  @ViewChild('stepper') stepper: MatStepper;

  daysSelected: any[] = [];
  event: any;
  isUserChecked: boolean;

  constructor(
    private dialogRef: MatDialogRef<ConsultorOnboardingComponent>,
    private userService: UserService,
    public toastService: ToastServiceService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.initialValidator();
    this.isUserChecked = false;;

  }

  initialValidator() {
    this.firstFormGroup = this._formBuilder.group({
      nic: this._formBuilder.control('', [
        Validators.required
      ]),
    });
    this.secondFormGroup = this._formBuilder.group({
      slot: ['', Validators.required],
    });
    this.isEditable = false;
  }

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find(x => x == date) ? "selected" : null;
  };
  
  select(event: any, calendar: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x == date);
    if (index < 0) this.daysSelected.push(date);
    else this.daysSelected.splice(index, 1);
  
    calendar.updateTodaysDate();
  }
  
  userFind() {
    this.spinner.show();
    if (this.firstFormGroup.valid) {
      this.userModel.nic=this.searchNic;
    this.userService.getByNic(this.userModel).subscribe(
      (user: any) => {
        this.userModel = user.data;
        this.spinner.hide();
        this.isUserChecked = true;
      }, error => {
        this.spinner.hide();
        this.userModel.nic='';
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  } else {
    this.spinner.hide();
    this.mandatoryValidation(this.firstFormGroup)
  }
  }

  secondScreen() {
    this.stepper.next();
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

  closeDialog() {
    this.dialogRef.close();
  }

  get nic() {
    return this.firstFormGroup.get('nic');
  }

  get slot() {
    return this.secondFormGroup.get('slot');
  }
}
