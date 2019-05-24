import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, flatMap } from 'rxjs/operators';

import { User } from '../models/user';
import { Network } from '../models/network';

import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentTokenSubject: BehaviorSubject<String>;
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient, 
        private userService: UserService) {
        this.currentTokenSubject = new BehaviorSubject<String>(localStorage.getItem('currentToken'));
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentTokenValue(): String {
        return this.currentTokenSubject.value;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        localStorage.removeItem('currentToken');
        this.currentTokenSubject.next(null);
        return this.http.post<any>(`${Network.apiUrl}/token`, null, {
            headers: new HttpHeaders().set('Authorization', `Basic ${window.btoa(username + ':' + password)}`)
        })
    }

    getUser(loginReponse: any) {
        let value = loginReponse
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentToken', value.token);
        this.currentTokenSubject.next(value.token);
        return this.userService.getById(value.sub);
    }

    logout() {
        return this.http.delete<any>(`${Network.apiUrl}/token`)
            .pipe(map(res => {
                // remove user from local storage to log user out
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
                
                return res;
            }));
    }
}