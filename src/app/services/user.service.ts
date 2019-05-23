import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { Network } from '../models/network';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getById(id: number): Observable<User> {
        return this.http.get<User>(`${Network.apiUrl}/user/${id}`);
    }

    register(user: User) {
        return this.http.post(`${Network.apiUrl}/user`, user);
    }

    update(user: User) {
        return this.http.put(`${Network.apiUrl}/user/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${Network.apiUrl}/user/${id}`);
    }
}