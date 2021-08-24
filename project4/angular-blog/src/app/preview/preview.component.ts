import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @Input() post : Post;
  @Output() editPost = new EventEmitter<Post>(); 

  constructor() { }

  ngOnInit(): void {
  }

  convertToMarkdown(text)
  {
    var reader = new Parser();
    var writer = new HtmlRenderer();
    var parsed = reader.parse(text); // parsed is a 'Node' tree
    // transform parsed if you like...
    var result = writer.render(parsed); // result is a String
    return result
  }

}
