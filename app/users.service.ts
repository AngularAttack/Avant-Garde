import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  private url = "http://jsonplaceholder.typicode.com/users";

  constructor(private _http: Http) {
  }

  getUsers() {
    return this._http.get(this.url).map(response => response.json())
  }

  getUser(userId) {
    return this._http.get(this.url + '/' + userId).map(response => response.json())
  }

  addUsers(user) {
    return this._http.post(this.url, JSON.stringify(user)).map(response => response.json())
  }

  updateUser(user) {
    return this._http.put(this.url + '/' + user.id, JSON.stringify(user)).map(response => response.json())
  }

  deleteUser(userId) {
    return this._http.delete(this.url + '/' + userId)
         .map(res => res.json());
   }
}
