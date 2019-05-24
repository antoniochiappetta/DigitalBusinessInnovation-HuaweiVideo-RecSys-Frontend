import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/home']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .subscribe(
                data => {
                    if (data.sub && data.token) {
                        this.authenticationService.getUser(data)
<<<<<<< HEAD
                            .subscribe(
                                user => {
                                    localStorage.setItem('currentUser', JSON.stringify(user));
                                    this.authenticationService.currentUserSubject.next(user);
                                    console.log("got user")
                                    console.log('login -next');
                                    this.router.navigate(['/home']);
                                },
                                error => {
                                    console.log("login -error");
                                    this.alertService.error(error);
                                    this.loading = false;
                                }
                            )
=======
                        .subscribe(
                            user => {
                                localStorage.setItem('currentUser', JSON.stringify(user));
                                this.authenticationService.currentUserSubject.next(user);
                                console.log("got user")
                                console.log('login -next');
                                this.loading = false;
                                this.router.navigate(['/home']);
                            },
                            error => {
                                console.log("login -error");
                                this.alertService.error(error);
                                this.loading = false;
                            }
                        )
>>>>>>> db141dd9f4996249ea73f847f02a2c77d1b0dd45
                    }
                },
                error => {
                    console.log('login -error');
                    this.alertService.error(error);
                    this.loading = false;
                })

    }
}
