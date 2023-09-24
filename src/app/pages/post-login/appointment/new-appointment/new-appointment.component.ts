import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { StorageService } from 'src/app/models/StorageService';
import { Appoinment } from 'src/app/models/appoinment';
import { Consultor } from 'src/app/models/consultor';
import { ConsultorDays } from 'src/app/models/consultorDays';
import { SlotDtoList } from 'src/app/models/slotDtoList';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { ConsultantDaysService } from 'src/app/services/consultant-days/consultant-days.service';
import { ConsultorService } from 'src/app/services/consultor/consultor.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit {
  public statusList: SimpleBase[];
  public specializationList: SimpleBase[];
  public timeSlotList: SimpleBase[];
  public consultantModel = new Consultor();
  public consultorDays = new ConsultorDays();
  public consultor = new Consultor();
  public slotDtoList = new SlotDtoList();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable: boolean;
  isFinished: boolean;
  consultantAdd: FormGroup;

  searchSpecialization: string;

  selectedSlotList: number[];
  @ViewChild('stepper') stepper: MatStepper;

  daysSelected: any[] = [];
  event: any;
  isUserChecked: boolean;
  userId: number;
  consultantId: number;

  consultantDaysResponse: any;
  availableDates: any;
  dateControl = new FormControl();
  disabledDates = [];
  dayRelatedSlots: SimpleBase[] = [];
  selectedTimeSlot: string;
  isConsultantDisable: boolean;
  isDateDisable: boolean;
  isSlotDisable: boolean;
  isAppoinmentCreate: boolean;

  public appoinment = new Appoinment();

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }

    for (const disabledDate of this.disabledDates) {

      if (
        date.getDate() === disabledDate.getDate() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getFullYear() === disabledDate.getFullYear()
      ) {
        return true;
      }
    }

    return false; // Date is enabled
  };

  constructor(
    private dialogRef: MatDialogRef<NewAppointmentComponent>,
    private appointmentService: AppointmentService,
    private consultantDaysService: ConsultantDaysService,
    public toastService: ToastServiceService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private consultorService: ConsultorService,
    private sessionStorage: StorageService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initialValidator();
    this.isUserChecked = false;
    this.isFinished = false;
    const user = this.sessionStorage.getItem("user");
    this.consultor.activeUserName = user.user.username;
    this.consultorDays.activeUserName = user.user.username;
    this.userId = user.user.id
    this.availablitySet();
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  availablitySet() {
    this.isDateDisable = true;
    this.isSlotDisable = true;
    this.isAppoinmentCreate = false;
    this.isConsultantDisable = false;
  }
  initialValidator() {
    this.firstFormGroup = this._formBuilder.group({
      spe_id: this._formBuilder.control('', [
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

  consultantFind() {
    this.spinner.show();
    if (this.firstFormGroup.valid) {
      this.appointmentService.getConsultantBySpecialization(this.searchSpecialization).subscribe(
        (consultant: any) => {
          this.consultantId = consultant.data.id;
          this.consultantModel = consultant.data;
          this.consultantDaysGet();
          this.isDateDisable = false;
          this.isConsultantDisable = true;
        },error => {
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

  consultantDaysGet() {
    this.consultorDays.con_id = this.consultantId
    this.consultantDaysService.getConsultantDaysByCon(this.consultorDays).subscribe(
      (response: any) => {
        this.consultantDaysResponse = response;
        this.availableDates = response.data.availability.daysLists.map(item => item.day.split('T')[0]); // Replace with your actual data
        this.availableDates
        for (let index = 0; index < this.availableDates.length; index++) {
          this.disabledDates.push(new Date(this.availableDates[index]));

        }
        this.spinner.hide();
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

  onDateSelected(event: any) {
    const inputDate = event.value.toISOString().split('T')[0];


    // Check if consultantDaysResponse is defined and contains the expected properties
    if (!this.consultantDaysResponse?.data?.availability?.daysLists) {
      return;
    }

    const filteredList = this.consultantDaysResponse.data.availability.daysLists
      .filter(item => {
        const itemDate = new Date(item.day).toISOString().split('T')[0];
        return itemDate === inputDate;
      });

    if (filteredList.length === 0) {
      this.dayRelatedSlots = [];
      this.isDateDisable = false;
      this.isSlotDisable = true;
      return;
    }

    const uniqueSlotCodes = [...new Set(filteredList[0]?.slot || [])];

    this.dayRelatedSlots = uniqueSlotCodes.map(code => {
      const timeSlot = this.timeSlotList.find(slot => slot.code === code);
      if (timeSlot) {
        return {
          id: timeSlot.id,
          value: timeSlot.value,
          code: timeSlot.code,
          description: timeSlot.description,
          name: timeSlot.name
        };
      } else {
        return {
          id: 0,
          value: 0,
          code: code as string,
          description: 'Description not found',
          name: 'Name not found'
        };
      }
    });

    if (this.dayRelatedSlots.length === 0) {
      this.isDateDisable = false;
      this.isSlotDisable = true;
    } else {
      this.isDateDisable = true;
      this.isSlotDisable = false;
    }

    this.cdRef.detectChanges();
  }

  onTimeSlotSelected(selectedCode: string) {
    this.isAppoinmentCreate = true;
  }

  submitAppoinment() {
    this.appoinment.consultantId = this.consultantId;
    this.appoinment.activeUserName = this.consultor.activeUserName;
    this.appoinment.userId = this.userId;
    const formattedDate = this.datePipe.transform(this.dateControl.value, 'yyyy-MM-dd');
    this.appoinment.bookedDate = formattedDate;
    this.appoinment.slotId = this.selectedTimeSlot;
    this.appoinment.status = 'active';


    this.appointmentService.createAppoinment(this.appoinment).subscribe(
      (response: any) => {
        this.toastService.successMessage(response.responseDescription);
        this.spinner.hide();
      },error => {
        this.spinner.hide();
        if (error.status === 401) {
          this.handleUnauthorizedError();
        } else {

          this.toastService.errorMessage(error.error['errorDescription']);
        }
      }
    );
  }

  resetAppoinment() {
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.consultantModel = new Consultor();
    this.dateControl.reset();
    this.availablitySet();
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

  get spe_id() {
    return this.firstFormGroup.get('spe_id');
  }

  get slot() {
    return this.secondFormGroup.get('slot');
  }

  get status() {
    return this.consultantAdd.get('status');
  }
}
