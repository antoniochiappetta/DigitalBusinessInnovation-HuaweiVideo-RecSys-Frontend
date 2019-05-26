import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../models/user';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { AuthenticationService } from '../../services/authentication.service';
import { InteractionService } from '../../services/interaction.service';
import { AlertService } from '../../services/alert.service';
import { EmbedVideoService } from 'ngx-embed-video';
import { Interaction } from 'src/app/models/interaction';

@Component({
  selector: 'movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy {

  // MARK: - Properties

  loading = false;
  currentUser: User;
  currentUserSubscription: Subscription;
  movie: Movie;

  backdrop: any;
  poster: any;
  iframe: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private interactionService: InteractionService,
    private alertService: AlertService,
    private movieService: MovieService,
    private embedService: EmbedVideoService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(user => {
      this.currentUser = user;
    })
    this.route.queryParams.subscribe(data => {
      this.movieService.getMovieById(data.movieId).subscribe(data => {
        this.movie = data
        this.getImages();
        this.setInteraction();
        this.iframe = this.embedService.embed(this.movieService.getYoutubeTrailer(this.movie));
        // console.log(this.movie.video)
      });
    })
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

  // MARK: - Interaction

  setInteraction() {
    let interaction = new Interaction()
    interaction.user_id = this.currentUser.id;
    interaction.movie_id = this.movie.id;
    this.loading = true;
    this.interactionService.registerInteraction(interaction).subscribe(
      data => {
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

}