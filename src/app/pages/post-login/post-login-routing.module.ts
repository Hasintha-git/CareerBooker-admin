import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostLoginComponent } from './post-login.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { FoodcityManagementComponent } from './foodcity-management/foodcity-management.component';
import { BiteManagementComponent } from './bite-management/bite-management.component';
import { PendingOrderComponent } from './pending-order/pending-order.component';
import { ApprovedOrderComponent } from './approved-order/approved-order.component';
import { DeliveredOrderComponent } from './delivered-order/delivered-order.component';
import { TrendingItemComponent } from './trending-item/trending-item.component';
import { CategoryManagementComponent } from './category-management/category-management.component';

const routes: Routes = [
  {path:'',component:PostLoginComponent, children:[
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent},
    {path:'customer-management',component:CustomerManagementComponent},
    {path:'foodcity-management',component:FoodcityManagementComponent},
    {path:'bite-management',component:BiteManagementComponent},
    {path:'pending-order',component:PendingOrderComponent},
    {path:'approved-order',component:ApprovedOrderComponent},
    {path:'delivered-order',component:DeliveredOrderComponent},
    {path:'trending-item',component:TrendingItemComponent},
    {path:'category-management',component:CategoryManagementComponent},
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
