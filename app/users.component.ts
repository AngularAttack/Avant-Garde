import {Component, OnInit} from 'angular2/core';
import {UsersService} from './users.service';
import {RouterLink} from 'angular2/router';


@Component({
  selector: 'user',
  template: `
  <h1>Users</h1>
  <a class="btn btn-primary" [routerLink]="['NewUser']">Add New User</a>
  <table class="table table-bordered">
   <thead>
     <tr>
       <th>Name</th>
       <th>Email</th>
       <th>Edit</th>
       <th>Delete</th>
     </tr>
   </thead>
   <tbody>
     <tr *ngFor="#user of users">
       <td>{{ user.name }}</td>
       <td>{{ user.email }}</td>
       <td>
                 <i class="glyphicon glyphicon-edit" [routerLink]="['EditUser', { id: user.id }]"></i>
       </td>
       <td>
                 <i (click)="deleteUser(user)" class="glyphicon glyphicon-remove clickable"></i>
             </td>
     </tr>
   </tbody>
  </table>
  `,
  providers: [UsersService],
  directives: [RouterLink]
})
export class UsersComponent {
  users: any[];
  constructor(private _usersService: UsersService) { }

  ngOnInit() {
    this._usersService.getUsers().subscribe(users => this.users = users);
  }

  deleteUser(user){
    if (confirm("Are you sure you want to delete " + user.name + "?")) {
      var index = this.users.indexOf(user)
      // Here, with the splice method, we remove 1 object
            // at the given index.
            this.users.splice(index, 1);
      this._usersService.deleteUser(user.id)
        .subscribe(null,
          err => {
            alert("Could not delete the user.");
                        // Revert the view back to its original state
                        // by putting the user object at the index
                        // it used to be.
            this.users.splice(index, 0, user);
          });
    }
  }
}
