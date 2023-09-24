import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { StorageService } from 'src/app/models/StorageService';
import { Consultor } from 'src/app/models/consultor';
import { ConsultorDays } from 'src/app/models/consultorDays';
import { SlotDtoList } from 'src/app/models/slotDtoList';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/AuthService';
import { ConsultantDaysService } from 'src/app/services/consultant-days/consultant-days.service';
import { ConsultorService } from 'src/app/services/consultor/consultor.service';
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
  public consultorDays = new ConsultorDays();
  public consultor = new Consultor();
  public slotDtoList = new SlotDtoList();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable: boolean;
  isFinished: boolean;
  consultantAdd: FormGroup;

  searchNic: string;
  selectedSlotList: number[];
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
    private consultorService: ConsultorService,
    private consultantDaysService: ConsultantDaysService,
    private sessionStorage: StorageService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initialValidator();
    this.isUserChecked = false;
    this.isFinished =false;
    const user=this.sessionStorage.getItem("user");
    this.consultor.activeUserName = user.user.username;
    this.consultorDays.activeUserName = user.user.username;
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

    this.consultantAdd = this._formBuilder.group({
      spe_id: this._formBuilder.control('', [
        Validators.required
      ]),
      status: this._formBuilder.control('', [
        Validators.required
      ]),
    })
  }
  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
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
      this.userModel.nic = this.searchNic;
      this.userService.getByNic(this.userModel).subscribe(
        (user: any) => {
          this.userModel = user.data;
          this.spinner.hide();
          this.isUserChecked = true;
        },  error => {
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
    } else {
      this.spinner.hide();
      this.mandatoryValidation(this.firstFormGroup)
    }
  }

  checkModification() {
    this.consultorDays.slotDtoList = [];

    for (let index = 0; index < this.daysSelected.length; index++) {
      const slotDto = {
        day: this.daysSelected[index],
        timeSlots: this.selectedSlotList
      };
      this.consultorDays.slotDtoList.push(slotDto);
    }

    this.isFinished=true;

  }

  updateSlotDtoList(dto: any, i: number) {

  }


  submitAvailability() {
    this.spinner.show();
    this.consultantDaysService.add(this.consultorDays).subscribe((response: any) => {
      this.spinner.hide();
      this.toastService.successMessage(response.responseDescription);
          this.dialogRef.close();
    }, error => {
      this.spinner.hide();
      this.toastService.errorMessage(error.error['errorDescription']);
    })
  }

  secondScreen() {

    this.spinner.show();
    if (this.consultantAdd.valid) {
      this.consultor.userId = this.userModel.id;
      this.consultorService.add(this.consultor).subscribe(
        (reponse: any) => {
          this.consultorDays.con_id = reponse.data;
          this.stepper.next();
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.toastService.errorMessage(error.error['errorDescription']);
        }
      );
    } else {
      this.spinner.hide();
      this.mandatoryValidation(this.consultantAdd)
    }

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

  get spe_id() {
    return this.consultantAdd.get('spe_id');
  }

  get status() {
    return this.consultantAdd.get('status');
  }
}
