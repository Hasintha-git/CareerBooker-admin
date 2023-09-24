import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { MatDialog } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { Consultor } from 'src/app/models/consultor';
import { ConsultorService } from 'src/app/services/consultor/consultor.service';
import { StorageService } from 'src/app/models/StorageService';
import { MatPaginator } from '@angular/material/paginator';
import { Commondatasource } from 'src/app/datasources/commondatasource';
import { merge, tap } from 'rxjs';
import { PAGE_LENGTH } from 'src/app/utility/constants/system-config';
import { CommonFunctionsService } from 'src/app/services/common-functions/common-function.service';
import { ConsultorOnboardingComponent } from './consultor-onboarding/consultor-onboarding.component';
import { ViewConsultorComponent } from './view-consultor/view-consultor.component';
import { DeleteConsultorComponent } from './delete-consultor/delete-consultor.component';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-consultor',
  templateUrl: './consultor.component.html',
  styleUrls: ['./consultor.component.scss']
})
export class ConsultorComponent implements OnInit, OnDestroy {
  public userSearch: FormGroup;
  public userList: Consultor[];
  public searchModel: Consultor;
  public statusList: SimpleBase[];
  public specializationList: SimpleBase[];
  public timeSlotList: SimpleBase[];
  public isSearch: boolean;
  public access: any;
  breakpoint :any;

  public dataSourceUser: Commondatasource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public toast: ToastServiceService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private consultorService: ConsultorService,
    private formBuilder: FormBuilder,
    private sessionStorage: StorageService,
    private commonFunctionService: CommonFunctionsService,
    private authService: AuthService,
    public toastService: ToastServiceService,
  ) {
  }



  ngOnInit() {
    this.spinner.show();
    this.searchModel = new Consultor();
    this.searchModel.pageNumber=0;
    this.searchModel.pageSize=5;
    this.prepareReferenceData();
    this.initialDataLoader();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
    this.initialForm();
    this.access=this.sessionStorage.getItem("userrole");

  }

  initialForm() {
    this.userSearch = this.formBuilder.group({
      username: this.formBuilder.control('', []),
      spe_id: this.formBuilder.control('', []),
      status: this.formBuilder.control('', []),
      nic: this.formBuilder.control('', []),
    });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 3;
  }
  prepareReferenceData(): void {
    this.consultorService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
        this.specializationList = response.specializationList;
        this.timeSlotList = response.timeSlotList;
        this.spinner.hide();
      },
      error => {
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
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  ngAfterViewInit() {
    this.dataSourceUser.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    merge(this.paginator.page)
      .pipe(
        tap(() => this.getList())
      )
      .subscribe();
  }


  initialDataLoader(): void {
    this.initialDataTable();
    this.dataSourceUser = new Commondatasource();
    this.dataSourceUser.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    this.getList();
  }
  initialDataTable() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = PAGE_LENGTH;
  }


  change(event) {

  }

  getList() {
    this.spinner.show();
    let searchParamMap = this.commonFunctionService.getDataTableParam(this.paginator,null);
    if (this.isSearch) {
      searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    }
    this.consultorService.getList(searchParamMap)
      .subscribe((data: any) => {
        this.userList = data.records;
        this.dataSourceUser.datalist = this.userList;
        this.dataSourceUser.usersSubject.next(this.userList);
        this.dataSourceUser.countSubject.next(data.totalRecords);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        if (error.status === 401) {
          this.handleUnauthorizedError();
        } else {

          this.toast.errorMessage(error.error['errorDescription']);
        }
      }
    );
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: Consultor): Map<string, string> {
    if (searchModel.username) {
      searchParamMap.set("username", searchModel.username);
    }
    if (searchModel.nic) {
      searchParamMap.set("nic", searchModel.nic);
    }
    if (searchModel.spe_id) {
      searchParamMap.set("spe_id", searchModel.spe_id);
    }
    if (searchModel.status) {
      searchParamMap.set("status", searchModel.status);
    }
    return searchParamMap;
  }

  searchUser(search: boolean) {
    this.isSearch = search;
    this.initialDataLoader();
  }

  resetUserSearch() {
    this.userSearch.reset();
    this.initialDataLoader();
  }

  add() {
    const dialogRef = this.dialog.open(ConsultorOnboardingComponent, { width: '80%', height: '475px' });
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.componentInstance.specializationList = this.specializationList;
    dialogRef.componentInstance.timeSlotList = this.timeSlotList;
    dialogRef.afterClosed().subscribe(result => {
      this.resetUserSearch();
    });
  }

  edit(id: any) {
    // Implement your logic to edit a user.
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(DeleteConsultorComponent, { data: id, width: '350px', height: '180px' });

    dialogRef.afterClosed().subscribe(result => {
      this.resetUserSearch();
    });
  }

  view(id: any) {
    const dialogRef = this.dialog.open(ViewConsultorComponent, { data: id });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  get username() {
    return this.userSearch.get('username');
  }

  get fullName() {
    return this.userSearch.get('fullName');
  }

  get status() {
    return this.userSearch.get('status');
  }

  get spe_id() {
    return this.userSearch.get('spe_id');
  }

  get nic() {
    return this.userSearch.get('nic');
  }

  
}
