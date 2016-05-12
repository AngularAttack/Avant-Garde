import {Component, OnInit} from 'angular2/core';
import {PostsService} from './posts.service';
import {UsersService} from './users.service';
import {PaginationComponent} from './pagination.component';

@Component({
  selector: 'posts',
  template: `
  <h1>{{ title }}</h1>
  <div class="row">
    <div class="col-md-6">
    <select class="form-control" (change)="reloadPosts({ userId: u.value })" #u>
      <option value="">Select a user...</option>
      <option *ngFor="#user of users" value="{{ user.id }}">{{ user.name }}</option>
    </select>
    <pagination [items]="posts" (page-changed)="onPageChanged($event)"></pagination>
      <i *ngIf="isLoading" class="fa fa-spinner fa-spin fa-3x"></i>
      <ul class="list-group">
          <li *ngFor="#post of pagedPosts"
              class="list-group-item"
              [class.active]="currentPost == post"
              (click)="selectPost(post)">
              {{ post.title }}
          </li>
      </ul>
    </div>
    <div class="col-md-6">
      <div *ngIf="currentPost" class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">{{ currentPost.title }}</h3>
        </div>
        <div class="panel-body">
            <p>{{ currentPost.body }}</p>
            <hr/>
            <i *ngIf="commentsLoading" class="fa fa-spinner fa-spin fa-3x"></i>
            <div class="media" *ngFor="#comment of currentPost.comments">
                <div class="media-left">
                    <a href="#">
                        <img class="media-object thumbnail" src="http://lorempixel.com/80/80/people?random={{ comment.id }}" alt="...">
                    </a>
                </div>
                <div class="media-body">
                    <h4 class="media-heading">
                        {{ comment.name }}
                    </h4>
                    {{ comment.body }}
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .posts li { cursor: default; }
  .posts li:hover { background: #ecf0f1; }
  .list-group-item.active,
  .list-group-item.active:hover,
  .list-group-item.active:focus {
      background-color: #ecf0f1;
      border-color: #ecf0f1;
      color: #2c3e50;
  }
  `],
  providers: [PostsService, UsersService],
  directives: [PaginationComponent]
})
export class PostsComponent implements OnInit {
  title: "Posts";
  posts = [];
  isLoading;
  currentPost = false;
  commentsLoading;
  users = [];
  pageSize = 10;
  pagedPosts = [];

  constructor(
    private _postsService: PostsService,
    private _usersService: UsersService){ }

  ngOnInit() {
    this.loadPosts();
    this.loadUsers();
  }

  private loadUsers() {
    this._usersService.getUsers()
      .subscribe(users => this.users = users, );
  }

  private loadPosts(filter?) {
    this.isLoading = true;
    this._postsService.getPosts(filter)
      .subscribe(
        posts => {
        this.posts = posts;
        this.pagedPosts = this.getPostsInPage(1);
      },
      null,
      () => { this.isLoading = false; });
  }

  selectPost(post) {
    this.currentPost = post;
    this.commentsLoading = true;
    this._postsService.getComments(post.id)
        .subscribe(comments => {
          this.commentsLoading = false;
          this.currentPost.comments = comments
        });
  }

  reloadPosts(filter) {
    this.currentPost = null;
    this.loadPosts(filter);
  }

  onPageChanged(page) {
        this.pagedPosts = this.getPostsInPage(page);
  }

  private getPostsInPage(page){
   let result = [];
   let startingIndex = (page - 1) * this.pageSize;
   let endIndex = Math.min(startingIndex + this.pageSize, this.posts.length);
   for (let i = startingIndex; i < endIndex; i++)
       result.push(this.posts[i]);

   return result;
  }
}
