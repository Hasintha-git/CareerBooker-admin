import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { CommonFunctionsService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultantDaysService {

  requestUrl: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService) {
    this.requestUrl = `${getEndpoint(SECURE)}/consultant-days/v1/admin`;
  }

  // Add this method to retrieve the token from localStorage
  private getToken(): string | null {
    const token = localStorage.getItem('token');
    // Check if token is surrounded by double quotes and remove them
    if (token && token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    }
    return token;
  }

  // Update your HTTP requests to include the token in the headers
  private getRequestHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  add(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl, object, { responseType: 'json', headers });
  }

  getConsultantDaysByCon(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl + `/find-con`, object, { responseType: 'json', headers });
  }

}
