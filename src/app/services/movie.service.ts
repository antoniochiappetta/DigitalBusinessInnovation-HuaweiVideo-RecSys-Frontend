import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../models/movie';
import { Network } from '../models/network';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
    constructor(private http: HttpClient) { }

    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${Network.apiUrl}/movie/${id}`);
    }

    getTopPop(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${Network.apiUrl}/movie/toppop`);
    }

    getWatchedByUserId(user_id: number): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${Network.apiUrl}/movie/watched/${user_id}`);
    }

    getRecommendedByUserId(user_id: number): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${Network.apiUrl}/movie/recommended/${user_id}`);
    }

    getMoviesByKeywords(query: string[]): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${Network.apiUrl}/movie/searchByKeywords`, {
            params: {
                q: query
            }
        });
    }
}