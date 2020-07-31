import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoadingFiles= true;
  searchLabel: string = "";
  fileUploads: Observable<string[]>;
  label: string;
  posts: Post[] = [];
  showFile = false;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 10;
  currentPage = 1;
  labelToCheck;
  pageSizeOption = [1, 2, 5, 10, 20, 30];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private paginator: MatPaginatorIntl,
    private authService: AuthService
  ) {
    this.paginator.itemsPerPageLabel = 'Registros por página';
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage, this.searchLabel);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage, this.searchLabel);
  }

  onSeeFiles(label: string){
    this.labelToCheck = label;
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage, this.searchLabel);
    });
  }

  showFiles(enable: boolean, label: string) {
    this.showFile = enable;
    if (label == ''){
      label = 'All';
    }
    if (enable) {
      this.fileUploads = this.postsService.getFiles(label);
    }
  }

  OnSearch(searchLabel: string){
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage, this.searchLabel);

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
