import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { StorageService } from 'src/app/models/StorageService';
import { Consultor } from 'src/app/models/consultor';
import { ConsultorDays } from 'src/app/models/consultorDays';
import { SlotDtoList } from 'src/app/models/slotDtoList';
import { User } from 'src/app/models/user';
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
    private sessionStorage: StorageService
  ) { }

  ngOnInit(): void {
    this.initialValidator();
    this.isUserChecked = false;;
    const user=this.sessionStorage.getItem("user");
    console.log("user",user.username)
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
        }, error => {
          this.spinner.hide();
          this.userModel.nic = '';
          this.toastService.errorMessage(error.error['errorDescription']);
        }
      );
    } else {
      this.spinner.hide();
      this.mandatoryValidation(this.firstFormGroup)
    }
  }

  checkModification() {
    console.log("checked")
    console.log(this.selectedSlotList)
    console.log(this.daysSelected)
    this.consultorDays.slotDtoList = [];

    for (let index = 0; index < this.daysSelected.length; index++) {
      const slotDto = {
        day: this.daysSelected[index],
        timeSlots: this.selectedSlotList
      };
      this.consultorDays.slotDtoList.push(slotDto);
    }

    console.log("list", this.consultorDays.slotDtoList)
  }

  updateSlotDtoList(dto: any, i: number) {
    // Assuming you want to update the first item in slotDtoList
    // this.consultorDays.slotDtoList[0].timeSlots = selectedTimeSlots;
    console.log(dto);
    console.log(i)

    // You can add more logic here to update other parts of slotDtoList if needed
  }



  secondScreen() {

    this.spinner.show();
    if (this.consultantAdd.valid) {
      this.consultor.userId = this.userModel.id;
      this.consultorService.add(this.consultor).subscribe(
        (reponse: any) => {
          this.consultorDays.con_id = reponse.data;
          console.log(">>>>>>>>",this.consultorDays.con_id)
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
