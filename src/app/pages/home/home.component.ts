import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Post } from '../../models/posts';
import { ApiService } from '../../services/api.service';
import {ConfirmDialogComponent} from "../../components/confirm-dialog-component/confirm-dialog-component";
import {EditPostDialogComponent} from "../../components/edit-post-dialog/edit-post-dialog.component";
import {NewPostDialogComponent} from "../../components/new-post-dialog/new-post-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  dataSource = new MatTableDataSource<Post>();
  displayedColumns: string[] = ['id', 'title', 'body', 'actions'];
  subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllPosts(): void {
    this.subscription.add(
      this.apiService.getAll().subscribe({
        next: (data: Post[]) => {
          this.dataSource.data = data;
        },
        error: (error) => console.error(error),
      })
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deletePost(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Are you sure you want to delete this post?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Proceed with deletion logic
        this.apiService.delete(id).subscribe({
          next: () => {
            console.log('Post deleted successfully');
            this.getAllPosts(); // Refresh the list after deletion
          },
          error: (error) => console.error('Error deleting post', error),
        });
      }
    });
  }
  editPost(post: Post): void {
    const dialogRef = this.dialog.open(EditPostDialogComponent, {
      width: '400px',
      data: { post: Object.assign({}, post) } // Pass a copy of the post object to avoid direct modification
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.update(post.id, result).subscribe({
          next: () => {
            console.log('Post updated successfully');
            this.getAllPosts(); // Refresh the list to reflect the updates
          },
          error: (error) => console.error('Error updating post', error)
        });
      }
    });
  }
  createNewPost(): void {
    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.create({...result,userId:1}).subscribe({
          next: (newPost) => {
            console.log('Post created successfully', newPost);
            this.getAllPosts(); // Refresh the list to include the new post
          },
          error: (error) => console.error('Error creating post', error)
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
