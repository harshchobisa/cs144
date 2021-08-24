<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>List Post</title>
</head>
<body>
    <div><h1>Blog Post List for User <%= request.getParameter("username") %></h1></div>
    <form>
        <div>
            <form action="post" method="POST">
                <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
                <input type="hidden" name="postid" value="0">
                <button type="submit" name="action" value="open">New Post</button>
            </form>
            <table style="width:100%">
                <tr>
                  <th>Title</th>
                  <th>Modified</th> 
                  <th>Created</th>
                  <th></th>
                </tr>
                <%@ page import="java.util.ArrayList" %>
                <%  ArrayList<ArrayList<String>> posts = (ArrayList<ArrayList<String>>)request.getAttribute("posts"); 
                    for (int i=0; i < posts.size(); i++) { %>
                <tr>
                  <td><%= posts.get(i).get(1) %></td>
                  <td><%= posts.get(i).get(2) %></td>
                  <td><%= posts.get(i).get(3) %></td>
                  <td>

                    <form action="post" method="POST">
                        <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
                        <input type="hidden" name="postid" value=<%= posts.get(i).get(0) %>>
                        <input type="hidden" name="title" value="<%= posts.get(i).get(1)%>">
                        <input type="hidden" name="body" value="<%= posts.get(i).get(4) %>">
                        <button type="submit" name="action" value="open">Open</button>
                    </form>


                    <form action="post" method="POST">
                        <input type="hidden" name="username" value="<%= request.getParameter("username") %>">
                        <input type="hidden" name="postid" value=<%= posts.get(i).get(0) %>>
                        <button type="submit" name="action" value="delete">Delete</button>
                    </form>
                  </td>

                </tr>

                <%  } %>
              </table>
        </div>
    </form>
</body>
</html>
