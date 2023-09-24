import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { User } from 'src/app/models/user';
import { Commondatasource } from 'src/app/datasources/commondatasource';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user/user.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/services/common-functions/common-function.service';
import { LAST_UPDATED_TIME, PAGE_LENGTH, SORT_DIRECTION } from 'src/app/utility/constants/system-config';
import { DataTable } from 'src/app/models/data-table';
import { merge, tap } from 'rxjs';
import { StorageService } from 'src/app/models/StorageService';
import { AuthService } from 'src/app/services/AuthService';
import { AddSpecializationComponent } from './add-specialization/add-specialization.component';
import { EditSpecializationComponent } from './edit-specialization/edit-specialization.component';
import { DeleteSpecializationComponent } from './delete-specialization/delete-specialization.component';
import { ViewSpecializationComponent } from './view-specialization/view-specialization.component';
import { Specialization } from 'src/app/models/specialization';
import { SpecializationService } from 'src/app/services/specialization/specialization.service';

@Component({
  selector: 'app-specialization',
  templateUrl: './specialization.component.html',
  styleUrls: ['./specialization.component.scss']
})
export class SpecializationComponent implements  OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public speSearch: FormGroup;
  public dataSourceSpe: Commondatasource;
  public speList: Specialization[];
  public searchModel: Specialization;
  public statusList: SimpleBase[];
  public searchReferenceData: Map<string, Object[]>;
  public isSearch: boolean;
  public access:any;

  displayedColumns: string[] = ['view', 'id', 'name', 'status','action'];


  constructor(
    public dialog: MatDialog,
    public toast: ToastServiceService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private specializationService: SpecializationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionsService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.spinner.show();
    this.searchModel = new Specialization();
    this.prepareReferenceData();
    this.initialDataLoader();
    this.initialForm();

  }

  initialForm() {
    this.speSearch = this.formBuilder.group({
      name: this.formBuilder.control('', []),
      status: this.formBuilder.control('', []),
    });
  }

  prepareReferenceData(): void {
    this.specializationService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
      },
        error => {
          this.toast.errorMessage(error.error['message']);
        }
      );
  }

  ngAfterViewInit() {
    this.dataSourceSpe.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        tap(() => this.getList())
      )
      .subscribe();
  }


  initialDataLoader(): void {
    this.initialDataTable();
    this.dataSourceSpe = new Commondatasource();
    this.dataSourceSpe.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    this.getList();
  }

  getList() {
    let searchParamMap = this.commonFunctionService.getDataTableParam(this.paginator, this.sort);
    if (this.isSearch) {
      searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    }
    this.specializationService.getList(searchParamMap)
      .subscribe((data: DataTable<Specialization>) => {
        this.speList = data.records;
        this.dataSourceSpe.datalist = this.speList;
        this.dataSourceSpe.usersSubject.next(this.speList);
        this.dataSourceSpe.countSubject.next(data.totalRecords);
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

  
  private handleUnauthorizedError() {
    this.authService.logout();
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: Specialization): Map<string, string> {

    if (searchModel.name) {
      searchParamMap.set(this.displayedColumns[2].toString(), searchModel.name);
    }
    if (searchModel.status) {
      searchParamMap.set(this.displayedColumns[3].toString(), searchModel.status);
    }
    return searchParamMap;
  }


  initialDataTable() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = PAGE_LENGTH;
  }

  search(search: boolean) {
    this.isSearch = search;
    this.initialDataLoader();
  }

  resetSearch() {
    this.speSearch.reset();
    this.initialDataLoader();
  }

  add() {
    const dialogRef = this.dialog.open(AddSpecializationComponent);
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.afterClosed().subscribe(result => {
      this.resetSearch();
    });
  }

  edit(id: any) {
    const dialogRef = this.dialog.open(EditSpecializationComponent, { data: id });
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.afterClosed().subscribe(result => {
      this.resetSearch();
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(DeleteSpecializationComponent, { data: id, width: '350px', height: '180px' });

    dialogRef.afterClosed().subscribe(result => {
      this.resetSearch();
    });
  }

  view(id: any) {
    const dialogRef = this.dialog.open(ViewSpecializationComponent, { data: id });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }


  get name() {
    return this.speSearch.get('name');
  }

  get status() {
    return this.speSearch.get('status');
  }
}

