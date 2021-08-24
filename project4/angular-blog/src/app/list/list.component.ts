import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  @Input() posts : Post[];
  @Output() openPost = new EventEmitter<Number>(); 
  @Output() newPost = new EventEmitter<void>(); 

  constructor() { }

  //copied from https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
  dateConversion(unix_timestamp)
  {
    var date = new Date(unix_timestamp).toLocaleDateString("en-US");
    var time = new Date(unix_timestamp).toLocaleTimeString("en-US");

    return date + " "+ time
  }


  ngOnInit(): void {
  }

}




