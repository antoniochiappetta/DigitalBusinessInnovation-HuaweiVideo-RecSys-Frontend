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
  selector: 'movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  loading = false;
  currentUser: User;
  currentUserSubscription: Subscription;
  movie: Movie;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private movieService: MovieService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user;
    })
    this.movie = new Movie()
    this.movie.id = 1
    this.movie.description = "Una rivisitazione live-action del film Disney del 1992 con lo stesso nome."
    this.movie.title = "Aladdin (2019)"
    this.movie.rating = {
      score: 4.5,
      support: 10
    }
    this.movie.tmdbId = 420817
    this.movie.video = "JcMtWwiyzpU"
    this.getImages();
  }

  ngOnInit() {
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

  // MARK: - Images

  backdrop: any;
  poster: any;

  getImages() {
    this.loading = true;
    this.movieService.getMovieImages(this.movie).subscribe(imagesResponse => {
      this.movieService.getMoviePoster(imagesResponse).subscribe(data => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.poster = reader.result;
        }, false);
    
        if (data) {
            reader.readAsDataURL(data);
        }
        this.movieService.getMovieBackdrop(imagesResponse).subscribe(data => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
              this.backdrop = reader.result;
          }, false);
      
          if (data) {
              reader.readAsDataURL(data);
          }
          this.loading = false;
        }, error => {
          this.loading = false;
          console.log(error);
        });
      }, error => {
        this.loading = false;
        console.log(error);
      });
    })
  }

}