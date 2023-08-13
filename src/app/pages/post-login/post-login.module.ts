import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { PostLoginComponent } from './post-login.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { FoodcityManagementComponent } from './foodcity-management/foodcity-management.component';
import { BiteManagementComponent } from './bite-management/bite-management.component';
import { PendingOrderComponent } from './pending-order/pending-order.component';
import { ApprovedOrderComponent } from './approved-order/approved-order.component';
import { DeliveredOrderComponent } from './delivered-order/delivered-order.component';
import { TrendingItemComponent } from './trending-item/trending-item.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [
    PostLoginComponent,
    DashboardComponent,
    CustomerManagementComponent,
    FoodcityManagementComponent,
    BiteManagementComponent,
    PendingOrderComponent,
    ApprovedOrderComponent,
    DeliveredOrderComponent,
    TrendingItemComponent,
    CategoryManagementComponent,
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
    MatExpansionModule
  ]
})
export class PostLoginModule { }
