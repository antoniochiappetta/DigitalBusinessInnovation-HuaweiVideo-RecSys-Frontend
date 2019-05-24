import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../../models/user';
import { Movie } from '../../models/movie';
import { UserService } from '../../services/user.service';
import { MovieService } from '../../services/movie.service';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit, OnDestroy {
    loading = false;
    currentUser: User;
    currentUserSubscription: Subscription;
    topPopMovies: Movie[] = [];
    recommendedMovies: Movie[] = [];
    searchResults: Movie[] = [];
    watchedMovies: Movie[] = [];
    query: string = "";

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService,
        private movieService: MovieService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    getTopPopMovies(): void {
        this.movieService.getTopPop()
            .subscribe(topPopMovies => this.topPopMovies = topPopMovies);
    }

    getRecommendedMovies(): void {
        this.movieService.getRecommendedByUserId(this.currentUser.id)
            .subscribe(recommendedMovies => this.recommendedMovies = recommendedMovies);
    }

    getWatchedMovies(): void {
        this.movieService.getWatchedByUserId(this.currentUser.id)
            .subscribe(watchedMovies => this.watchedMovies = watchedMovies);
    }

    getSearchResults(): void {
        this.movieService.getMoviesByKeywords((this.query.replace(/  +/g, ' ')).split(" "))
            .subscribe(searchResults => this.searchResults = searchResults);
    }

    
    ngOnInit() {
        // this.getTopPopMovies();
        // this.getRecommendedMovies();
        // this.getWatchedMovies();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    logout() {
        this.loading = true;
        this.authenticationService.logout()
            .subscribe(
                _ => {
                    console.log('logout -next');
                    this.loading = false;
                    this.router.navigate(['/login']);
                },
                error => {
                    console.log('logout -error');
                    this.alertService.error(error);
                    this.loading = false;
                })
    }
}