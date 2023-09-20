import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { PostLoginComponent } from './post-login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserComponent } from './user/user.component';
import { RegexFormateModule } from 'src/app/utility/directive/regex-formate.module';
import { Empty } from 'src/app/utility/pipes/empty';
import { ViewUserComponent } from './user/view-user/view-user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { DeleteUserComponent } from './user/delete-user/delete-user.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConsultorComponent } from './consultor/consultor.component';
import { ConsultorOnboardingComponent } from './consultor/consultor-onboarding/consultor-onboarding.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppointmentComponent } from './appointment/appointment.component';
import { NewAppointmentComponent } from './appointment/new-appointment/new-appointment.component';

@NgModule({
  declarations: [
    PostLoginComponent,
    DashboardComponent,
    UserComponent,
    Empty,
    ViewUserComponent,
    AddUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    ConsultorComponent,
    ConsultorOnboardingComponent,
    AppointmentComponent,
    NewAppointmentComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
    MatGridListModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
    ClipboardModule,
    MatExpansionModule,
    MatPaginatorModule,
    RegexFormateModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatStepperModule,
    MatFormFieldModule
  ],
  exports: [
    Empty
  ],
  providers: [DatePipe],
})
export class PostLoginModule { }
