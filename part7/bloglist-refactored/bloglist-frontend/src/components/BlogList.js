import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadLikeBlog, loadRemoveBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

import { Link } from "react-router-dom";


const Blog = ({ user, blog }) => {
  const [infoVisible, setInfoVisibile] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // Newly added blog hold user ID first then
    // populates it later with user info
    if (!blog.user.username) {
      setIsOwner(true);
    } else {
      user.username === blog.user.username
        ? setIsOwner(true)
        : setIsOwner(false);
    }
  }, [user, blog]);

  const handleBlogInfo = () => {
    setInfoVisibile(!infoVisible);
  };

  const handleLikeButton = () => {
    const toUpdate = {
      ...blog,
      likes: blog.likes + 1,
    };
    dispatch(loadLikeBlog(toUpdate));
    dispatch(setNotification(`"${blog.title}" +1 like!`, 5))
  };

  const handleRemoveButton = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(loadRemoveBlog(blog))
    }
  };

  const inlineParagraph = {
    display: "inline-block",
    marginRight: 10,
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blog-info-wrapper" style={blogStyle}>
      <Link 
        to={`/blogs/${blog.id}`}
        className="blog-title-link"
        style={inlineParagraph}>
          {blog.title}
      </Link>  
      <button className="blog-view-btn" onClick={handleBlogInfo}>
        view
      </button>
      {infoVisible ? (
        <>
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">
            {blog.likes} <button onClick={handleLikeButton}>like</button>
          </p>
          <p className="blog-author">{blog.author}</p>
          {isOwner ? (
            <button className="blog-remove-btn" onClick={handleRemoveButton}>
              remove
            </button>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};


const BlogList = () => {
  const blogs = useSelector(state => state.blogs);

  return (
    <ul style={{paddingLeft:0}}>
      {blogs.map(blog => 
        <Blog
          key={blog.id}
          user={blog.user}
          blog={blog}
        />
      )}
    </ul>
  )
}


export default BlogList;
