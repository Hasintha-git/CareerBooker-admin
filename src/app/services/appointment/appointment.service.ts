import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {Observable,Subject,throwError} from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { DataTable } from 'src/app/models/data-table';
import { CommonFunctionsService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService  {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/appointment/v1/admin`;
  }

  getSearchData(full: boolean): Observable<any> {
    let params = new HttpParams().set('full', full.toString());
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.get(this.requestUrl+ `/search-reference-data` , {
      responseType: 'json',
      headers: httpHeaders,
      params
    });
  }

  getList(searchParamMap: Map<string, string>): Observable<DataTable<any>> {
    let httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.get(this.requestUrl+ `/filter-list`, {
      headers: httpHeaders,
      params: httpParams,
      responseType: 'json'
    });
  }


  get(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/find-id`, object, {responseType: 'json'});
  }

  getConsultantBySpecialization(id: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/consultant-by-specialization/`+`${id}`, {responseType: 'json'});
  }

  deleteUser(object: any): Observable<any> {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.delete(this.requestUrl, {
      responseType: 'json',
      headers: httpHeaders
    });
  }

  createAppoinment(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/schedule` , object, {responseType: 'json'});
  }

  update(object: any): Observable<any> {
    return this.httpClient.put(this.requestUrl  , object, {responseType: 'json'});
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      // The backend returned a 401 status code, indicating authentication failure.
      errorMessage = error.error.msg;
    } else if (error.status === 400) {
      // The backend returned a 400 status code, indicating authentication failure.
      errorMessage = error.error.msg;
    } else if (error.status === 500) {
      // The backend returned a 400 status code, indicating authentication failure.
      errorMessage = 'Application Error Please Contact System Administrator';
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `${error.error.msg}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  };

}