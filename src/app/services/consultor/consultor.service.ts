import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { DataTable } from 'src/app/models/data-table';
import { CommonFunctionsService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultorService {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/consultant/v1/admin`;
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
    let params = new HttpParams().set('full', full.toString());
    const headers = this.getRequestHeaders();
    return this.httpClient.get(this.requestUrl+ `/search-reference-data`, {
      responseType: 'json',
      headers: headers,
      params
    });
  }

  getList(searchParamMap: Map<string, string>): Observable<DataTable<any>> {
    let httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    const headers = this.getRequestHeaders();
    return this.httpClient.get(this.requestUrl+ `/filter-list`, {
      headers: headers,
      params: httpParams,
      responseType: 'json'
    });
  }

  get(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl+ `/find-id`, object, {responseType: 'json', headers: headers });
  }

  deleteUser(id: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.delete(this.requestUrl+ `/`+ `${id}`, {
      responseType: 'json',
      headers: headers
    });
  }

  add(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.post(this.requestUrl  , object, {responseType: 'json', headers: headers });
  }

  update(object: any): Observable<any> {
    const headers = this.getRequestHeaders();
    return this.httpClient.put(this.requestUrl  , object, {responseType: 'json', headers: headers });
  }

 
}
