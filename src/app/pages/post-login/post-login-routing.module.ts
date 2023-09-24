import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostLoginComponent } from './post-login.component';
import { UserComponent } from './user/user.component';
import { ConsultorComponent } from './consultor/consultor.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { SpecializationComponent } from './specialization/specialization.component';

const routes: Routes = [
  {path:'',component:PostLoginComponent, children:[
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent},
    {path:'user',component:UserComponent},
    {path:'consultor',component:ConsultorComponent},
    {path:'appoinment', component:AppointmentComponent},
    {path:'specialization', component:SpecializationComponent}
    // {
    //   path: 'employee-analytics',
    //   loadChildren: () => import('./employee-analytics/employee-analytics.module').then(m => m.EmployeeAnalyticsModule),
    // },
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLoginRoutingModule { }
