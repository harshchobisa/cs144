export class Post {
    postid: number = 0;
    created: number = 0;
    modified: number = 0;
    title: string = "";
    body: string = "";
};

export const ExistingPosts = [
    {
        postid : 1,
        created : 1518669758370,
        modified : 0,
        title : "## firstPost",
        body : "hello world"
    },
    {
        postid : 2,
        created : 1518669758371,
        modified : 0,
        title : "secondPost",
        body : "hello two"
    }
]

export const postToEdit = 
    {
        postid : 1,
        created : 1518669758370,
        modified : 0,
        title : "firstPost",
        body : "hello world"
    }
