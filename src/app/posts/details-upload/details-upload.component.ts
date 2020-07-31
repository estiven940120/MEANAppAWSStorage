import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

//const BACKEND_URL = environment.apiURL;

@Component({
  selector: 'details-upload',
  templateUrl: './details-upload.component.html',
  styleUrls: ['./details-upload.component.css']
})
export class DetailsUploadComponent implements OnInit {
  BACKEND_URL:string = environment.apiURL;
  @Input() fileUpload: string;

  constructor() { }

  ngOnInit() {
  }

}
