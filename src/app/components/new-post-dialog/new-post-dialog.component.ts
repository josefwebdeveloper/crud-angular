import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
  styleUrls: ['./new-post-dialog.component.scss']
})
export class NewPostDialogComponent implements OnInit {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewPostDialogComponent>
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  submitForm(): void {
    if (this.postForm.valid) {
      this.dialogRef.close(this.postForm.value);
    }
  }
}
