import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Post } from "../../models/posts"; // Ensure this path matches your Post model location

@Component({
  selector: 'app-edit-post-dialog',
  templateUrl: './edit-post-dialog.component.html',
  styleUrls: ['./edit-post-dialog.component.scss']
})
export class EditPostDialogComponent implements OnInit, AfterViewInit {
  // Assuming 'post' will be of type 'Post' for type safety and IntelliSense in your template
  post: Post;

  constructor(
    public dialogRef: MatDialogRef<EditPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post }) { // Destructuring directly in the parameter
    this.post = data.post; // Safely assuming data contains 'post'
    console.log(this.post, 'Constructor: post');
  }

  ngOnInit(): void {
    console.log('ngOnInit: Data available -');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit: View initialized');
  }

  save(): void {
    // Assuming 'post' reflects any edits made in the dialog
    this.dialogRef.close(this.post); // Close the dialog and return the edited 'post'
  }
}
