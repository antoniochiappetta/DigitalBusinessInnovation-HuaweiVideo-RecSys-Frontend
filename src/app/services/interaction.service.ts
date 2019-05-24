import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Interaction } from '../models/interaction'
import { Network } from '../models/network';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InteractionService {
  constructor(private http: HttpClient) { }

  registerInteraction(interaction: Interaction) {
    return this.http.post(`${Network.apiUrl}/interaction`, interaction);
  }

  getInteractionsByUserId(user_id: number, movie_id: number): Observable<Interaction> {
    return this.http.get<Interaction>(`${Network.apiUrl}/user/${user_id}:${movie_id}/explicit`);
  }
}