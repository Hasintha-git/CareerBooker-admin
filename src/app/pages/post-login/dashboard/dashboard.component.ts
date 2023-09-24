import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dashboard } from 'src/app/models/dashboard';
import { AuthService } from 'src/app/services/AuthService';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public id: any;
  public dashboardModel = new Dashboard();

  constructor(
    private dashboardService: DashboardService,
    public toastService: ToastServiceService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  prepareReferenceData(): void {
    this.dashboardService.getHeader(true)
      .subscribe((response: any) => {
        this.dashboardModel.pendingData = response.pendingData;
        this.dashboardModel.cancelData = response.cancelData;
        this.dashboardModel.completedData = response.completedData;
      },
        error => {
          this.toastService.errorMessage(error.error['message']);
        }
      );
  }

  ngOnInit(): void {
    this.prepareReferenceData();
  }

// Line Chart Data
lineChartData = [
  {
    name: 'Series A',
    series: [
      { name: 'Jan', value: 120 },
      { name: 'Feb', value: 150 },
      { name: 'Mar', value: 100 },
      // Add more data points as needed
    ],
  },
];

// Pie Chart Data
pieChartData = [
  {
    name: 'Category A',
    value: 25,
  },
  {
    name: 'Category B',
    value: 60,
  },
  {
    name: 'Category C',
    value: 15,
  },
];

colorScheme = {
  domain: ['#0096FE', '#18CFFC', '#E6F2FD'],
};

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }
}
