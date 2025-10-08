import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class XapiService {

  constructor(private http: HttpClient) { }

  private getHeaders(auth: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(auth)
    });
  }


  async sendStatement(statement: any, lrsEndpointUrl:string, auth: string): Promise<void> {
    const headers = this.getHeaders(auth);
     if (navigator.onLine) {
        let endpoint = lrsEndpointUrl + "/statements";
        console.log("endpoint", endpoint);
      try {
        await this.http.post(endpoint, statement, { headers }).toPromise();
      } catch (err) {
        console.warn('Failed to send, saving offline', err);
        
      }
    }
  };
}