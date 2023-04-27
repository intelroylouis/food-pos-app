import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// 現状このサービスは使っていません。

@Injectable({
  providedIn: 'root'
})
export class RestService {
  apiUrl = 'http://localhost:3000';

  constructor(public http: HttpClient) {
    console.log('Hello RestService');
  }


  getUsers = () => {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/products').subscribe(data => {
      resolve(data); },
      err => {
      console.log(err);
      });
    });
    }

  // getUsers() {

  //   fetch(this.apiUrl + '/products', {method: 'GET'})
  //   .then(res => {return res.json()});
  //   }
}
