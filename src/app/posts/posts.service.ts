import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

const BACKEND_URL = environment.apiURL;

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number, searchLabel: string ) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}&searchLabel=${searchLabel}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + '/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                label: post.label,
                age: post.age,
                gender: post.gender,
                scholarship: post.scholarship,
                ocupation: post.ocupation,
                age_dcl: post.age_dcl,
                age_dementia: post.age_dementia,
                content: post.content,
                id: post._id,
                records: post.records,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }
  //
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', BACKEND_URL + '/files/uploadSingle', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  //
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      label: string;
      age: string;
      gender: string;
      scholarship: string;
      ocupation: string;
      age_dcl: string;
      age_dementia: string;
      records: string;
      content: string;
      creator: string;
    }>(BACKEND_URL + '/posts/' + id);
  }

  addPost(label: string, age: string, gender: string, scholarship: string, ocupation: string, age_dcl: string, age_dementia: string, content: string, records: File) {
    const postData = new FormData();
    postData.append('label', label);
    postData.append('age', age);
    postData.append('gender', gender);
    postData.append('scholarship', scholarship);
    postData.append('ocupation', ocupation);
    postData.append('age_dcl', age_dcl);
    postData.append('age_dementia', age_dementia);
    postData.append('content', content);
    postData.append('records', records, label);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL + '/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/search']);
      });
  }

  updatePost(id: string,  label: string, age: string, gender: string, scholarship: string, ocupation: string, age_dcl: string, age_dementia: string, content: string, records: File | string) {
    let postData: Post | FormData;
    if (typeof records === 'object') {
      postData = new FormData();
      postData.append('label', label);
      postData.append('age', age);
      postData.append('gender', gender);
      postData.append('scholarship', scholarship);
      postData.append('ocupation', ocupation);
      postData.append('age_dcl', age_dcl);
      postData.append('age_dementia', age_dementia);
      postData.append('content', content);
      postData.append('records', records, label);
    } else {
      postData = {
        id: id,
        label: label,
        age: age,
        gender: gender,
        scholarship: scholarship,
        ocupation: ocupation,
        age_dcl: age_dcl,
        age_dementia: age_dementia,
        records: records,
        content: content,
        creator: null,
      };
    }
    this.http
      .put(BACKEND_URL + '/posts/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/search']);
      });
  }

  getFiles(label: string): Observable<any> {
    return this.http.get(BACKEND_URL + '/files/show/' + label);
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + '/posts/' + postId);
  }
}
