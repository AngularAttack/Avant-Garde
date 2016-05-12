import {Component, OnInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {BasicValidators} from './basicValidator';
import {CanDeactivate, Router, RouteParams} from 'angular2/router';
import {UsersService} from './users.service';
import {User} from './user';

@Component({
  selector: 'adduser',
  template: `
  <h1>{{ title }}</h1>
  <div class="row">
     <div class="col-md-6 well">
        <form [ngFormModel]="form" (ngSubmit)="save()">
            <fieldset>
                <legend>
                    User
                </legend>
                <div class="form-group">
                    <label>Name</label>
                    <input [(ngModel)]="user.name" #name="ngForm" ngControl="name" type="text" class="form-control">
                    <div *ngIf="name.touched && !name.valid" class="alert alert-danger">
                         Name is required.
                     </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input [(ngModel)]="user.email" #email="ngForm" ngControl="email" type="text" class="form-control">
                    <div *ngIf="email.touched && !email.valid" class="alert alert-danger">
                        Type a valid email id.
                    </div>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input [(ngModel)]="user.phone" ngControl="phone" type="text" class="form-control">
                </div>
            </fieldset>
            <fieldset ngControlGroup="address">
                <legend>Address</legend>
                <div >
                    <div class="form-group">
                        <label>Street</label>
                        <input [(ngModel)]="user.address.street" ngControl="street" type="text" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Suite</label>
                        <input [(ngModel)]="user.address.suite" ngControl="suite" type="text" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>City</label>
                        <input [(ngModel)]="user.address.city" ngControl="city" type="text" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>ZipCode</label>
                        <input [(ngModel)]="user.address.zipcode" ngControl="zipcode" type="text" class="form-control">
                    </div>
                </div>
            </fieldset>
            <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Save</button>
        </form>
   </div>
  `,
  providers: [UsersService]
})
export class AddUserComponent implements OnInit, CanDeactivate{
  form: ControlGroup;
  title: string;
  user = new User();

  constructor(
    fb: FormBuilder,
    private _router: Router,
    private _routeParams: RouteParams,
    private _userService: UsersService) {
    this.form = fb.group({
      name: ['', Validators.required],
      email: ['', BasicValidators.email],
      phone: [],
      address: fb.group ({
        street: [],
        suite: [],
        city: [],
        zipcode: []
      })
    })
  }

  ngOnInit() {
    var id = this._routeParams.get("id");

    if (!id)
      return;

    this._userService.getUser(id)
      .subscribe(
      user => this.user = user,
      response => {
        if (response.status = 404) {
          this._router.navigate(['NotFound']);
        }
      });
  }

  save() {
    var result;
    if (this.user.id)
      result = this._userService.updateUser(this.user);
    else
      result = this._userService.addUsers(this.user)

    result.subscribe(x => {
                this._router.navigate(['Users']);
          });
  }

  routerCanDeactivate() {
    if (this.form.dirty)
      return confirm('You have unsaved changes. Are you sure you want to navigate away?');
    return true;
  }
}
