import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService
      .isAdmin() // trả về một Promise
      .then((authenticated: boolean) => {
        console.log('authenticated');
        console.log(authenticated);
        if (authenticated) {
          return true; // Cho phép sử dụng router
        } else {
          this.router.navigate(['/home']); //this.router.navigate('/login')
          return false; // Không cho phép sử dụng router
        }
      });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // call canActivate again in class
    return this.canActivate(childRoute, state);
  }
}
