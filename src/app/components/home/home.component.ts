import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
    searchForm: FormGroup;
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
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService,
        private movieService: MovieService,
        private location: Location
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.route.queryParams.subscribe(params => {
            if (params['q']) {
                this.query = params['q'];
                this.getSearchResults();
            }
        });
    }

    getTopPopMovies(): void {
        this.movieService.getTopPop()
            .subscribe(topPopMovies => {
                this.topPopMovies = topPopMovies

                this.topPopMovies.forEach((movie) => {
                    this.getImages(movie);
                });
            });
    }

    getRecommendedMovies(): void {
        this.movieService.getRecommendedByUserId(this.currentUser.id)
            .subscribe(recommendedMovies => {
                this.recommendedMovies = recommendedMovies

                this.recommendedMovies.forEach((movie) => {
                    this.getImages(movie);
                });
            });
    }

    getWatchedMovies(): void {
        this.movieService.getWatchedByUserId(this.currentUser.id)
            .subscribe(watchedMovies => {
                this.watchedMovies = watchedMovies

                this.watchedMovies.forEach((movie) => {
                    this.getImages(movie);
                });
            });
    }

    getSearchResults(): void {
        window.scroll(0, 0);
        this.location.go('/home?q=' + this.query);
        if (this.query == "") { this.searchResults = [] }
        else {
            this.movieService.getMoviesByKeywords((this.query.replace(/  +/g, ' ')))
                .subscribe(searchResults => {
                    this.searchResults = searchResults;
                    this.searchResults.forEach((movie) => {
                        this.getImages(movie);
                    });

                });
        }
    }

    getImages(movie: Movie) {
        this.loading = true;
        this.movieService.getMovieImages(movie).subscribe(imagesResponse => {
            this.movieService.getMoviePoster(imagesResponse).subscribe(data => {
                let reader = new FileReader();
                reader.addEventListener("load", () => {
                    movie.poster = reader.result;
                }, false);

                if (data) {
                    reader.readAsDataURL(data);
                }
                this.loading = false;
            }, error => {
                this.loading = false;
                console.log(error);
            });
        })
    }

    emptyQuery(): void {
        this.query = "";
    }


    ngOnInit() {
        this.getTopPopMovies();
        this.getRecommendedMovies();
        this.getWatchedMovies();
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

    // MARK: - Movie selection

    selectMovie(movie: Movie) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                'movieId': movie.id
            }
        };
        this.router.navigate(['movie-detail'], navigationExtras);
    }
}