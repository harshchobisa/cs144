<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview</title>
</head>
<body> 
    <div><h1>Preview Post <%= request.getParameter("postid") %> From User <%= request.getParameter("username") %> </h1></div>
    <form>
        <!-- <form action="http://localhost:8888/editor/post?action=open&username=<%= request.getParameter("username") %>&postid=<%= request.getParameter("postid") %>&title=<%= request.getParameter("title") %>&body=<%= request.getParameter("body") %>"> -->
        <!-- <form content="0; https://google.com">
            <input type="submit" value="Back to EEDDITOR" />
        </form> -->

        <form action="post" method="POST">
            <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
            <input type="hidden" name="postid" value=<%= request.getParameter("postid") %>>
            <input type="hidden" name="title" value="<%= request.getParameter("title") %>">
            <input type="hidden" name="body" value="<%= request.getParameter("body") %>">
            <button type="submit" name="action" value="open">Close Preview</button>
        </form>



        <!-- <div>
            <button type="button" href="http://localhost:8888/editor/post?action=open&username=<%= request.getParameter("username") %>&postid=<%= request.getParameter("postid") %>&title=<%= request.getParameter("title") %>&body=<%= request.getParameter("body") %>">Open</button>
        </div> -->
        <div>
            <label for="title">Title: <%= request.getParameter("title") %></label>
        </div>
        <div>
            <label for="body">Body</label>
            <%= request.getAttribute("html") %>
        </div>
    </form>
</body>
</html>
