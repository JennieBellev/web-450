/**
 * Author: Professor Krasso
 * Modified By: Jennifer Snyder
 * Date: 11/03/2026
 * File: user-create.component.ts
 * Description: User creation component for the APRE application.
 *
 * Summary of Changes (Task m-046):
 * 1. Removed unused RouterLink import from @angular/router and component imports array.
 * 2. Fixed accessibility bug on the Email label by updating the 'for' attribute from 'password' to 'email'.
 * 3. Replaced the standalone 'Return' anchor link at the bottom of the template with a 'Cancel' button inside the .form__actions container next to 'Submit'.
 * 4. Added flexbox styling to .form__actions to align the Cancel and Submit buttons with a 10px gap.
 * 5. Implemented the cancel() method to programmatically route users back to '/user-management/users'.
 */
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-create',
  standalone: true,
imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div>
      <h1>User Create</h1>
      @if (errorMessage) {
        <div class="message message--error">{{ errorMessage }}</div>
      }
      <form [formGroup]="newUserForm" (ngSubmit)="addUser();" class="form">
        <div class="form__group">
          <label class="label" for="username">Username<span class="required">*</span></label>
          <input class="input" type="text" formControlName="username" id="username" name="username">
        </div>

        <div class="form__group">
          <label class="label" for="password">Password<span class="required">*</span></label>
          <input type="password" class="input" formControlName="password" id="password" name="password">
        </div>

        <div class="form__group">
          <label class="label" for="email">Email<span class="required">*</span></label>
          <input class="input" type="text" formControlName="email" id="email" name="email">
        </div>

        <div class="form__group">
          <label class="label" for="role">Role<span class="required">*</span></label>
          <select class="select" formControlName="role" id="role" name="role">
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <!-- Task m-046: Replaced the bottom Return link with a Cancel button next to Submit inside form__actions to improve form UX and navigation consistency -->
        <div class="form__actions">
          <button type="button" class="button button--secondary" (click)="cancel()">Cancel</button>
          <input type="submit" class="button button--primary" value="Submit">
        </div>
      </form>
    </div>
  `,
  styles: `
    /* Task m-046: Add spacing between the Cancel and Submit buttons */
    .form__actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
  `
})
export class UserCreateComponent {
  errorMessage: string;

  newUserForm: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    role: [null, Validators.required]
  });

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    this.errorMessage = '';
  }

  // Task m-046: Navigate back to the UsersComponent when Cancel is clicked
  cancel() {
    this.router.navigate(['/user-management/users']);
  }

  addUser() {
    if (!this.newUserForm.valid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const newUser = {
      username: this.newUserForm.value.username,
      passwordHash: this.newUserForm.value.password,
      email: this.newUserForm.value.email,
      role: this.newUserForm.value.role
    };

    console.log('New User', newUser);

    this.http.post(`${environment.apiBaseUrl}/users`, {
      user: newUser
    }).subscribe({
      next: (user) => {
        console.log('User created', user);
        this.router.navigate(['/user-management/users']);
      },
      error: (error) => {
        console.error('Error creating user', error);
        this.errorMessage = error.message;
      }
    });
  }
}