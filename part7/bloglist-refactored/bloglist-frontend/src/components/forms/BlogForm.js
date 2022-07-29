import { useState } from "react";
import { useDispatch } from "react-redux";

import { createBlog } from "../../reducers/blogReducer";
// import { setNotification } from "../../reducers/notificationReducer";

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = event => {
    event === '' ? setValue('') : setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}


const BlogForm = ({toggleVisibility}) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");


  const dispatch = useDispatch();

  const actionCreateBlog = async (event) => {
    event.preventDefault();

    dispatch(createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    }));

    title.onChange('');
    author.onChange('');
    url.onChange('');

    toggleVisibility();
  };

  return (
    <div className="blog-form">
      <h3>create new</h3>
      <form onSubmit={actionCreateBlog}>
        <div className="form-field">
          <label>Title*:</label>
          <input
            {...title}
            className="title-input"
          />
        </div>
        <div className="form-field">
          <label>Author*:</label>
          <input
            {...author}
            className="author-input"
          />
        </div>
        <div className="form-field">
          <label>Url:</label>
          <input
            {...url}
            className="url-input"
          />
        </div>
        <button type="submit" className="create-blog-btn">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
