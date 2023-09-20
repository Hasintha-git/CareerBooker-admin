import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {Observable,Subject,throwError} from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { CommonFunctionsService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantDaysService {


  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/consultant-days/v1/admin`;
  }

  add(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl  , object, {responseType: 'json'});
  }

  getConsultantDaysByCon(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/find-con`, object, {responseType: 'json'});
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
