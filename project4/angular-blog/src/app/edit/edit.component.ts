import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() post : Post;
  @Output() savePost = new EventEmitter<Post>(); 
  @Output() deletePost = new EventEmitter<Post>(); 
  @Output() previewPost = new EventEmitter<Post>(); 


  updateTitle(event)
  {
    this.post.modified = Date.now()
    this.post.title = event.target.value
    if (this.post.postid != 0)
    {
      this.savePost.emit(this.post)
    }
  }

  updateBody(event)
  {
    this.post.modified = Date.now()
    this.post.body = event.target.value
    if (this.post.postid != 0)
    {
      this.savePost.emit(this.post)
    }
  }

  dateConversion(unix_timestamp)
  {
    var date = new Date(unix_timestamp).toLocaleDateString("en-US");
    var time = new Date(unix_timestamp).toLocaleTimeString("en-US");

    return date + " "+ time
  }

  constructor() { }

  ngOnInit(): void {
  }

}
