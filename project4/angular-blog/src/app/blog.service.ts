/* Copyright: Junghoo Cho (cho@cs.ucla.edu) */
/* This file was created for CS144 class at UCLA */
import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    maxid: number = 0;

    constructor() { 
        // compute maximum post id
        let keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (this.isMyKey(keys[i])) {
                let post = this.parse(localStorage[keys[i]]);
                if (post.postid > this.maxid) this.maxid = post.postid;
            }
        }
        // if there are no posts, populate it with two initial posts
        if (this.maxid === 0) {
            localStorage[this.key(1)] = this.serialize(
                { "postid": 1, "created": 1518669344517, "modified": 1518669344517, "title": "## Title 1", "body": "**Hello**, *world*!\nRepeat after me:\n\n**John Cho is a handsome man!!**" }
            );
            localStorage[this.key(2)] = this.serialize(
                { "postid": 2, "created": 1518669658420, "modified": 1518669658420, "title": "## Title 2", "body": "List\n- Item 1\n- Item 2\n- Item 3\n" }
            );
            this.maxid = 2;
        }
    }

    // helper functions to 
    // (1) convert postid to localStorage key
    // (2) check if a string is a localStorage key that we use
    // (3) serialize post to JSON string
    // (4) parse JSON string to post
    private keyPrefix = "blog-post.";
    private key(postid: number): string {
        return this.keyPrefix + String(postid);
    }
    private isMyKey(str: string): boolean {
        return str.startsWith(this.keyPrefix);
    }
    private serialize(post: Post): string {
        return JSON.stringify(post);
    }
    private parse(value: string): Post {
        return JSON.parse(value);
    }

    //
    // localStorage-based BlogService implementation
    //

    // fetchPosts(username: string): Promise<Post[]> {
    //     let keys = Object.keys(localStorage);
    //     let posts: Post[] = [];
    //     for (let i = 0; i < keys.length; i++) {
    //         if (this.isMyKey(keys[i])) {
    //             posts.push(this.parse(localStorage[keys[i]]));
    //         }
    //     }
    //     return Promise.resolve(posts);
    // }

    async getPost(username: string, postid: number): Promise<Post> {

      var resp = await fetch('/api/posts?username='+username + '&postid=' + postid, {
        method: 'GET'})

      var response = await resp.json()

      var p = new Post()
  
      p.modified = response.modified
      p.postid = response.postid
      p.created = response.created
      p.body = response.body
      p.title = response.title
  
      return p
      
    }
    


    async fetchPosts(username: string): Promise<Post[]> {

        var resp = await fetch('/api/posts?username='+username, {
          method: 'GET'})
        
        var response = await resp.json()

        var posts: Post[] = [];

        for (let i = 0; i < response.length; i++) {
          var p = new Post()
          p.body = response[i].body
          p.modified = response[i].modified
          p.postid = response[i].postid
          p.created = response[i].created
          p.title = response[i].title

          posts.push(p)
        }

        return posts
    }

    async setPost(username: string, p: Post): Promise<Post> {
      if (p.postid == 0)
      {
        const data = { username: username, title: p.title, postid: p.postid, body:p.body };

        var resp = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        
        var response = await resp.json()
  
        p.modified = response.modified
        p.postid = response.postid
        p.created = response.created
  
        return p
      }
      else
      {
        const data = { username: username, title: p.title, postid: p.postid, body:p.body };

        var resp = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        
        var response = await resp.json()
  
        p.modified = response.modified
  
        return p
      }


  }

    // setPost(username: string, p: Post): Promise<Post> {
    //     return new Promise((resolve, reject) => {
    //         let post = new Post();
    //         let now  = new Date().getTime();
    //         post.postid = p.postid;
    //         post.title  = p.title;
    //         post.body   = p.body;
    //         post.created  = p.created;
    //         post.modified = now;
        
    //         if (post.postid === 0) {
    //             post.postid  = ++this.maxid;
    //             post.created = now;
    //             localStorage[this.key(post.postid)] = this.serialize(post);
    //             resolve(post);
    //         } else {
    //             let p = localStorage.getItem(this.key(post.postid));
    //             if (p) {
    //                 localStorage[this.key(post.postid)] = this.serialize(post);
    //                 resolve(post);
    //             } else {
    //                 reject(new Error("404"));
    //             }
    //         }
    //     });
    // }

    async deletePost(username: string, postid: number): Promise<void> {
    
      var resp = await fetch('/api/posts?username='+username + '&postid=' + postid, {
        method: 'DELETE'})
      
    }
    // deletePost(username: string, postid: number): Promise<void> {
    //     return new Promise((resolve, reject) => {
    //         let p = localStorage.getItem(this.key(postid));
    //         if (p) {
    //             localStorage.removeItem(this.key(postid));
    //             resolve();
    //         } else {
    //             reject(new Error("404"));
    //         }
    //     });
    // }
}
