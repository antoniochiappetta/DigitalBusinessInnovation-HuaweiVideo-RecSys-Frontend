import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../models/movie';
import { Network } from '../models/network';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
    constructor(private http: HttpClient) { }

    // MARK: - Movies and recommendations from our backend

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
        return `${Network.youtubeUrl}/${movie.video}`
    }
}