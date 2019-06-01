import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../models/movie';
import { Network } from '../models/network';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MovieService {
    constructor(private http: HttpClient) { }

    // MARK: - Movies and recommendations from our backend

    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${Network.apiUrl}/movie/${id}`);
    }

    getTopPop(): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/toppop?per_page=20`).pipe(map(data => data.items));
    }

    getWatchedByUserId(user_id: number): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/watched/${user_id}?per_page=12`).pipe(map(data => data.items));
    }

    getRecommendedByUserId(user_id: number): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/recommended/${user_id}?per_page=36`).pipe(map(data => data.items));
    }

    getMoviesByKeywords(query: string): Observable<Movie[]> {
        return this.http.get<any>(`${Network.apiUrl}/movie/searchByKeywords?q=${query}`).pipe(map(data => data.items));
    }

    // MARK: - Images from TheMovieDB

    getMovieImages(movie: Movie): Observable<any> {
        return this.http.get<any>(`${Network.tmdbApiUrl}/${movie.tmdbId}/images?api_key=${Network.tmdbApiKey}`);
    }

    getMovieBackdrop(imagesResponse: any): Observable<Blob> {
        let imagePath = imagesResponse.backdrops[0].file_path;
        return this.http.get(`${Network.tmdbImageUrl}/${imagePath}`, { responseType: 'blob' });
    }

    getMoviePoster(imagesResponse: any): Observable<Blob> {
        let imagePath = imagesResponse.posters[0].file_path;
        return this.http.get(`${Network.tmdbImageUrl}/${imagePath}`, { responseType: 'blob' });
    }

    // MARK: - Youtube Trailers

    getYoutubeTrailer(movie: Movie): string {
        return `${Network.youtubeUrl}/${movie.ytbeId}`
    }
}