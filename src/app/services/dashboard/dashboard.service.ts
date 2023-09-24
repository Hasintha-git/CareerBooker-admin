import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastServiceService } from '../toast-service.service';
import { CommonFunctionsService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  requestUrl: string;
  session_User: any;


  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionsService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/dashboard/v1/admin`;
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
    

   getHeader(object: any): Observable<any> {

    const headers = this.getRequestHeaders();
    return this.httpClient.get(this.requestUrl + `/count-list`, {
      headers: headers,
      responseType: 'json'
    });

  }
}
