import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  user: any[] = [];


  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe((data: any) => {
      this.user = data;
    });
  }

  deleteCategory(id: string) {
    if (confirm('Bạn có muốn xóa người này không?')) {
      this.userService.delete(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
