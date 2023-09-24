import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { timeout } from 'rxjs/operators';
import { DataTable } from 'src/app/models/data-table';
import { CommonFunctionsService } from '../common-functions/common-function.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService, public router: Router) { 
    this.requestUrl = `${getEndpoint(SECURE)}/user/v1/admin`;
    this.requestUrlPreLogin = `${getEndpoint(SECURE)}/auth`;
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
  
  getSearchData(full: boolean): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    const headers = this.getRequestHeaders();
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      headers: headers,
      params: params
    });
  }

  getList(searchParamMap: Map<string, string>): Observable<DataTable<any>> {
    const httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    const headers = this.getRequestHeaders();
    return this.httpClient.get(this.requestUrl + `/filter-list`, {
      headers: headers,
      params: httpParams,
      responseType: 'json'
    });
  }

  get(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl + `/find-id`, object, { responseType: 'json', headers: headers });
  }

  getByNic(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl + `/find-nic`, object, { responseType: 'json', headers: headers });
  }

  deleteUser(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.delete(this.requestUrl, {
      responseType: 'json',
      headers: headers
    });
  }

  add(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl, object, { responseType: 'json', headers: headers });
  }

  update(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.put(this.requestUrl, object, { responseType: 'json', headers: headers });
  }

  userRegister(object: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Referrer-Policy': 'no-referrer'
    });
    return this.httpClient.post(this.requestUrl + `/register`, object, {
      headers: headers,
      responseType: 'json'
    });
  }

  preRegistration(object: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Referrer-Policy': 'no-referrer'
    });
    return this.httpClient.post(this.requestUrlPreLogin + `/register`, object, {
      headers: headers,
      responseType: 'json'
    });
  }

  userLogin(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrlPreLogin + `/login`, object);
  }

}
