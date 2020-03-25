import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

let AUTH_SERVER = "http://localhost:3000";

export interface User {  
  name: string;  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {

  }

  //https://stackoverflow.com/questions/46714480/httpclient-post-request-using-x-www-form-urlencoded
  sendToExpressServer(username: string) {
    headers: new HttpHeaders;

    console.log('http post begin....');
    
    const body = new HttpParams().set('username', username);
    
    return this.httpClient.post<string>('http://localhost:3000/third/angularPostDemoUrl', body.toString(),
    {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Access-Control-Allow-Origin', '*') //.set('Content-Type', 'application/x-www-form-urlencoded') //.set('Accept-Encoding', 'UTF-8').set('Access-Control-Allow-Origin', '*')
    }).subscribe(
      response => {
        console.log('response: ' + JSON.stringify(response));
      }      
    );
  }

  sendToExpressServer2(user: User) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    
  }

}
