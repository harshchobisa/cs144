import java.io.IOException;
import java.sql.* ;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.*;

import javax.lang.model.util.ElementScanner6;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {
    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    public Editor() {}

    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        if (request.getParameter("action") == null)
        {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        try {
            if (request.getParameter("postid") != null)
            {
                Integer.parseInt(request.getParameter("postid"));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String action = request.getParameter("action");

        Connection c = null;

        try {
             c = connect(); 
        } catch (Exception e) {
            System.out.println(e);        
        }

        if (action.equals("preview"))
        {
            preview(request, response);

        }
        else if (action.equals("open"))
        {
            open(request, response, c);

        }
        else if (action.equals("list"))
        {
            list(request, response, c);
        }
        else if (action.equals("delete"))
        {
            delete(request, response, c);

        }
        else if (action.equals("save"))
        {
            save(request, response, c);
        }
        else
        {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);

        }

        try { c.close(); } catch (Exception e) { /* ignored */ }

        return;
    }

    public Connection connect() 
        throws ClassNotFoundException
    {
        Connection c = null;
        try {
            c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144","");
        } catch (SQLException e) {
            System.out.println(e);
        }
        return c;
    } 

    public void open(HttpServletRequest request, HttpServletResponse response, Connection c)
        throws ServletException, IOException 
    {

        if (request.getParameter("username") == null ||
        request.getParameter("postid") == null) 
        { 
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String title = request.getParameter("title");
        String body = request.getParameter("body");

        if (request.getParameter("postid").equals("0"))
        {
            if (title == null)
            {
                title = "";
            }
            if (body == null)
            {
                body = "";
            }
        }
        else
        {
            if (request.getParameter("title") != null && request.getParameter("body") != null)
            {
                title = request.getParameter("title");
                body = request.getParameter("body");
            }
            else
            {
                ResultSet rs = null;
                PreparedStatement preparedStmt = null;
        
                try {
                    preparedStmt = c.prepareStatement(
                        "SELECT title, body FROM Posts WHERE username = ? and postid = ?"
                    );

                    String username = request.getParameter("username");
                    String postid = request.getParameter("postid");

                    preparedStmt.setString(1, username);
                    preparedStmt.setString(2, postid);

                    rs = preparedStmt.executeQuery();
        
                    while (rs.next()) {
                        ArrayList<String> row = new ArrayList<String>();
                        title =  rs.getString("title");
                        body =  rs.getString("body");
                    }
                } catch (Exception e) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    return;
                } finally {
                    try { rs.close(); } catch (Exception e) { /* ignored */ }
                    try { preparedStmt.close(); } catch (Exception e) { /* ignored */ }
                }

                if (title == null || body == null)
                {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    return;
                }

            }
        }

        request.setAttribute("title", title);
        request.setAttribute("body", body);

        request.getRequestDispatcher("/edit.jsp").forward(request, response);
    }

    public void preview(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException 
    {

        if (request.getParameter("username") == null ||
        request.getParameter("postid") == null ||
        request.getParameter("title") == null ||
        request.getParameter("body") == null ) 
        { 
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
       
        Parser parser = Parser.builder().build();
        HtmlRenderer renderer = HtmlRenderer.builder().build();

        String markdown = request.getParameter("body");
        String html = renderer.render(parser.parse(markdown));  

        request.setAttribute("html", html);

        try {
            request.getRequestDispatcher("/preview.jsp").forward(request, response);

        } catch (Exception e) {
            System.err.println(e);
        }


    }
    
    public void list(HttpServletRequest request, HttpServletResponse response, Connection con)
    throws ServletException, IOException 
    {

        if (request.getParameter("username") == null) 
        { 
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String username = request.getParameter("username");
        ArrayList<ArrayList<String>> posts = new ArrayList<ArrayList<String>>();

        ResultSet rs = null;
        PreparedStatement preparedStmt = null;

        try {
            preparedStmt = con.prepareStatement(
                "SELECT * FROM Posts WHERE username = ? "
            );
            preparedStmt.setString(1, username);
            rs = preparedStmt.executeQuery();

            while (rs.next()) {
                ArrayList<String> row = new ArrayList<String>();
                row.add(rs.getString("postid"));
                row.add(rs.getString("title"));
                row.add(rs.getString("modified"));
                row.add(rs.getString("created"));
                row.add(rs.getString("body"));


                posts.add(row);
            }

            if (posts.size() == 0)
            {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

        } catch (Exception e) {
            System.err.println(e);
        } finally {
            try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { preparedStmt.close(); } catch (Exception e) { /* ignored */ }
        }

        Collections.sort(posts, new Comparator<ArrayList<String>>() {    
            @Override
            public int compare(ArrayList<String> o1, ArrayList<String> o2) {
                return o1.get(0).compareTo(o2.get(0));
            }               
         });

        request.setAttribute("posts", posts);
        request.getRequestDispatcher("/list.jsp").forward(request, response);
    }

    /**
     * Handles HTTP POST requests
     * 
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        if (request.getParameter("action") == null)
        {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        try {
            if (request.getParameter("postid") != null)
            {
                Integer.parseInt(request.getParameter("postid"));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        String action = request.getParameter("action");

        Connection c = null;

        try {
             c = connect(); 
        } catch (Exception e) {
            System.out.println(e);        
        }

        if (action.equals("preview"))
        {
            preview(request, response);

        }
        else if (action.equals("open"))
        {
            open(request, response, c);

        }
        else if (action.equals("list"))
        {
            list(request, response, c);
        }
        else if (action.equals("delete"))
        {
            delete(request, response, c);

        }
        else if (action.equals("save"))
        {
            save(request, response, c);
        }
        else
        {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }

        try { c.close(); } catch (Exception e) { /* ignored */ }

    }



    public void delete(HttpServletRequest request, HttpServletResponse response, Connection con)
    throws ServletException, IOException 
    {

        if (request.getParameter("username") == null ||
        request.getParameter("postid") == null) 
        { 
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }


        String username = request.getParameter("username");
        String postid = request.getParameter("postid");

        PreparedStatement preparedStmt = null;

        try {
            preparedStmt = con.prepareStatement(
                "DELETE FROM Posts WHERE username = ? and postid = ?"
            );
            preparedStmt.setString(1, username);
            preparedStmt.setString(2, postid);

            int rs = preparedStmt.executeUpdate();

            if (rs == 0)
            {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

        } catch (Exception e) {
            System.err.println(e);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        } finally {
            // try { rs.close(); } catch (Exception e) { /* ignored */ }
            try { preparedStmt.close(); } catch (Exception e) { /* ignored */ }
        }

        request.getRequestDispatcher("/delete.jsp").forward(request, response);


 
    }


    public void save(HttpServletRequest request, HttpServletResponse response, Connection con)
    throws ServletException, IOException 
    {

        if (request.getParameter("username") == null ||
        request.getParameter("postid") == null ||
        request.getParameter("title") == null ||
        request.getParameter("body") == null) 
        { 
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        PreparedStatement preparedStmt = null;
        String postid = request.getParameter("postid");
        if (postid.equals("0"))
        {
            ResultSet rs = null;
            int newPostId = -1;
            try {
                preparedStmt = con.prepareStatement(
                    "SELECT MAX(postid) FROM Posts WHERE username = ?"
                );
                preparedStmt.setString(1, request.getParameter("username"));
    
                rs = preparedStmt.executeQuery();
                while (rs.next()) {
                    newPostId = rs.getInt("MAX(postid)");
                }
                
                newPostId = newPostId + 1;
            } catch (Exception e) {
                System.err.println(e);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            } finally {
                try { rs.close(); } catch (Exception e) { /* ignored */ }
                try { preparedStmt.close(); } catch (Exception e) { /* ignored */ }
            }

            try {
                preparedStmt = con.prepareStatement(
                    "INSERT INTO Posts VALUES(?, ?, ?, ?,  NOW(),  NOW())"
                );
                preparedStmt.setString(1, request.getParameter("username"));
                preparedStmt.setInt(2, newPostId);
                preparedStmt.setString(3, request.getParameter("title"));
                preparedStmt.setString(4, request.getParameter("body"));

                int t = preparedStmt.executeUpdate();
            
            } catch (Exception e) {
                System.err.println(e);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            } finally {
                try { preparedStmt.close(); } catch (Exception e) { /* ignored */ }
            }
        }
        else{
            try {
                preparedStmt = con.prepareStatement(
                    "UPDATE Posts SET title=?, body=?, modified=NOW() WHERE username=? and postid=?;"
                );

                preparedStmt.setString(1, request.getParameter("title"));
                preparedStmt.setString(2, request.getParameter("body"));
                preparedStmt.setString(3, request.getParameter("username"));
                preparedStmt.setString(4, request.getParameter("postid"));

                int t = preparedStmt.executeUpdate();

                if (t == 0)
                {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
            
            } catch (Exception e) {
                System.err.println(e);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            } finally {
                try { preparedStmt.close(); } catch (Exception e) { /* ignored */ }
            }
        }

        request.getRequestDispatcher("/save.jsp").forward(request, response);


    }






}

