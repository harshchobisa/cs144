import { ɵNullViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Post, ExistingPosts, postToEdit } from './post';
import { BlogService } from './blog.service';
import * as cookie from 'cookie';
// import { request } from 'https';

enum AppState { List, Edit, Preview };


@Component({
  selector: 'app-root',
  template: '<app-list></app-list> \
  <app-edit></app-edit> \
  ',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private blogService: BlogService) {
    console.log("WINDOWHARSH")
    console.log(window.location.hash)

    let cookies = cookie.parse(document.cookie);
    var cookieJSON = this.parseJWT(cookies)
    this.username = cookieJSON.usr;
    console.log("LIST LOADING")


    this.proxy()
    console.log("LIST DONE")
    console.log(this.posts)

    this.onHashChange()

    window.addEventListener("hashchange", () => this.onHashChange());


  }

  title = 'angular-blog';
  username: string;
  posts: Post[];
  currentPost: Post;
  appState: AppState;

  async proxy()
  {
    var a = await this.refreshList()
  }

  // event handlers for list component events
  openPost(post: Post) {
    if (this.currentPost != null && this.currentPost.postid != 0)
    {
      this.savePost(this.currentPost)
    }
    this.currentPost = post
    this.appState = AppState.Edit
    window.location.hash = '#/edit/' + this.currentPost.postid
  }
  newPost() {
    console.log("TOP OF NEW POST")
    console.log("one")

    var newPost = new Post
    newPost.postid = 0
    newPost.created = Date.now()
    newPost.modified = null
    newPost.title = ""
    newPost.body = ""
    console.log("two")

    this.currentPost = newPost
    this.appState = AppState.Edit
    console.log("three")

    this.refreshList()
    console.log("four")

    window.location.hash = '#/edit/' + this.currentPost.postid
  }
  // event handlers for edit component events
  previewPost(post: Post) {
    console.log("five")

    // this.appState = AppState.Preview
    console.log("six")

    window.location.hash = '#/preview/' + this.currentPost.postid
  }
  async savePost(post: Post) {
    if (post != null){
      if (post.postid == 0)
      {
        var updateFlag = 1
      }
      this.currentPost = post
      if (updateFlag == 1){
        this.currentPost = await this.blogService.setPost(this.username, post)

      }
      else{
        var resp = await this.blogService.setPost(this.username, post)
      }

    }
    this.refreshList()
  }
  async deletePost(post: Post) {
    var resp = await this.blogService.deletePost(this.username, post.postid)
    this.refreshList()
    this.currentPost = null;
    this.appState = AppState.List
    window.location.hash = '#/'
  }
  // event handlers for preview component events
  editPost(post: Post) {
    this.appState = AppState.Edit
    window.location.hash = '#/edit/' + this.currentPost.postid

  }

  async refreshList(){
    this.posts = await this.blogService.fetchPosts(this.username)
    return(this.posts)
  }

  parseJWT(token) 
  {
      token = token.jwt
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
  }

  isStateEdit(){
    return (this.appState == AppState.Edit)
  }
  isStatePreview(){
    return (this.appState == AppState.Preview)
  }
  isStateList(){
    return (this.appState == AppState.List)
  }

  async onHashChange(){
    console.log("TOP OF HASH CHANGE")
    // var actualPosts = await this.refreshList()
    console.log(window.location.hash)
    if (window.location.hash == '#/')
    {
      this.appState = AppState.List
      console.log("LIST MODE")
    }
    else if (window.location.hash.slice(0, 7) == '#/edit/')
    {
      this.appState = AppState.Edit
      var requestPostid = parseInt(window.location.hash.slice(7))

      if (requestPostid != 0){
        this.currentPost = await this.blogService.getPost(this.username, requestPostid);
      }
      else{
        var newPost = new Post()
        newPost.title = ""
        newPost.body = ""
        newPost.modified = Date.now()
        newPost.created = Date.now()
        newPost.postid = 0
        this.currentPost = newPost
      }

    }
    else if (window.location.hash.slice(0, 10) == '#/preview/')
    {
      this.appState = AppState.Preview
      console.log("PREVIEW MODE")

      var requestPostid = parseInt(window.location.hash.slice(10))

      console.log(requestPostid)
      // var toDisplay = null

      if (requestPostid != 0){
        this.currentPost = await this.blogService.getPost(this.username, requestPostid);
      }
      else{
        var newPost = new Post()
        newPost.title = ""
        newPost.body = ""
        newPost.modified = 0
        newPost.created = Date.now()
        newPost.postid = 0
        this.currentPost = newPost
        //handle new post
      }
    }
    else{
      this.appState = AppState.List
    }
  }


}

