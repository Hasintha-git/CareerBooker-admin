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
export class SpecializationService {
  requestUrl: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService, public router: Router) { 
    this.requestUrl = `${getEndpoint(SECURE)}/specialization/v1/admin`;
  }

  private getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token && token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    }
    return token;
  }
  
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


  delete(id: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.delete(this.requestUrl+`/` + `${id}`, {
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

}
