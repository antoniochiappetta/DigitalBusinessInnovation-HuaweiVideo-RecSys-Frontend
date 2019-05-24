import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { Network } from '../models/network';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        if (request.url.startsWith(Network.apiUrl)) {
            let currentToken = this.authenticationService.currentTokenValue;
            console.log('Looking for token');
            console.log(currentToken);
            if (currentToken) {
                request = request.clone({
                    setHeaders: { 
                        Authorization: `Bearer ${currentToken}`
                    }
                });
            }
        }

        return next.handle(request);
    }
}