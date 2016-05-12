import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from './home.component';
import {NavbarComponent} from './navbar.component';
import {UsersComponent} from './users.component';
import {AddUserComponent} from './adduser.component';
import {PostsComponent} from './posts.component';
import {NotFoundComponent} from './not-found.component';

@RouteConfig([
  { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
  { path: '/users', name: 'Users', component: UsersComponent },
  { path: '/users/new', name: 'NewUser', component: AddUserComponent },
  { path: '/users/:id', name: 'EditUser', component: AddUserComponent },
  { path: '/posts', name: 'Posts', component: PostsComponent },
  { path: '/not-found', name: 'NotFound', component: NotFoundComponent },
  { path: '/*other', name: 'Other', redirectTo: ['Home'] }
])
@Component({
    selector: 'my-app',
    template: `
      <navbar></navbar>
      <div class="container">
        <router-outlet></router-outlet>
      </div>`,
    directives: [NavbarComponent, ROUTER_DIRECTIVES]
})
export class AppComponent { }
