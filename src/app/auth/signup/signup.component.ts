import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service"
import { Subscription } from 'rxjs';


@Component({
  templateUrl: "./signup.component.html",
  styleUrls: [ "./signup.component.css"],
})
export class SignupComponent implements OnInit, OnDestroy {
  isValid = false;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService, private router :Router){}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }

  OnNavigeteLogin(){
    this.router.navigate(['/login']);
  }

  onConfirm(password: any, confirmPassword: any){
    alert(password + confirmPassword);
    if( password != confirmPassword){
      this.isValid = false;
    }

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
