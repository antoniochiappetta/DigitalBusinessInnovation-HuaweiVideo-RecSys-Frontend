import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../models/movie';
import { Network } from '../models/network';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MovieService {
    constructor(private http: HttpClient) { }

    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${Network.apiUrl}/movie/${id}`);
    }

    getTopPop(): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/toppop`).pipe(map(data => data.items));
    }

    getWatchedByUserId(user_id: number): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/watched/${user_id}`).pipe(map(data => data.items));
    }

    getRecommendedByUserId(user_id: number): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/recommended/${user_id}`).pipe(map(data => data.items));
    }

    getMoviesByKeywords(query: string[]): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/searchByKeywords`, {
            params: {
                q: query
            }
        }).pipe(map(data => data.items));
    }
}