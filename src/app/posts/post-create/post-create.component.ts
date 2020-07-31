import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

interface Genero {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  //
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  //

  generos: Genero[] = [
    {value: 'Masculino', viewValue: 'Masculino'},
    {value: 'Femenino', viewValue: 'Femenino'},
    {value: 'Otro', viewValue: 'Otro'}
  ];
  enteredLabel = "";
  enteredContent = "";
  fileName = "Debe agregar un archivo comprimido para continuar";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      label: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      age: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      gender: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]
      }),
      scholarship: new FormControl(null, {}),
      ocupation: new FormControl(null, {}),
      age_dcl: new FormControl(null, {}),
      age_dementia: new FormControl(null, {}),
      content: new FormControl(null, {}),
      records: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            label: postData.label,
            age: postData.age,
            gender: postData.gender,
            scholarship: postData.scholarship,
            ocupation: postData.ocupation,
            age_dcl: postData.age_dcl,
            age_dementia: postData.age_dementia,
            content: postData.content,
            records: postData.records,
            creator: postData.creator
          };
          this.form.setValue({
            label: this.post.label,
            age: this.post.age,
            gender: this.post.gender,
            scholarship: this.post.scholarship,
            ocupation: this.post.ocupation,
            age_dcl: this.post.age_dcl,
            age_dementia: this.post.age_dementia,
            content: this.post.content,
            records: this.post.records
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }
  //
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.fileName = this.selectedFiles[0].name;

  }

  upload() {
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.postsService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    });

    this.selectedFiles = undefined;
  }
//
  onRecordsPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ records: file });
    this.form.get("records").updateValueAndValidity();
     console.log(file);
     console.log(this.form);
     this.fileName = file.name;
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.label,
        this.form.value.age,
        this.form.value.gender,
        this.form.value.scholarship,
        this.form.value.ocupation,
        this.form.value.age_dcl,
        this.form.value.age_dementia,
        this.form.value.content,
        this.form.value.records
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.label,
        this.form.value.age,
        this.form.value.gender,
        this.form.value.scholarship,
        this.form.value.ocupation,
        this.form.value.age_dcl,
        this.form.value.age_dementia,
        this.form.value.content,
        this.form.value.records
      );
    }
    this.form.reset();
  }
}
