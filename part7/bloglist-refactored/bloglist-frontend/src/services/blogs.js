import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getAllFromAuthor = async (author) => {
  const params = {
    author: author,
  };

  const response = await axios.get(baseUrl, { params });
  return response.data;
};

const getBlog = async (title) => {
  const params = {
    title: title,
  };

  const response = await axios.get(baseUrl, { params });
  return response.data;
};

const create = async (newBlog) => {

  const config = {
    headers: { Authorization: token },
  };

  // console.log(`Token found! {${token}}`)
  // console.log("Adding to blog")
  // console.table(newBlog)

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  // console.log(`Token found! {${token}}`)
  // console.log("Updating blog")
  // console.table(updatedBlog)

  const response = await axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config
  );
  return response.data;
};

const updateComment = async (blogId, comment) => {
  const config = {
    headers: { 
      Authorization: token,
      "Content-Type": "text/plain"
     }
  };

  const response = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    comment,
    config
  );
  return response.data;
}

const remove = async (blogToBeRemoved) => {
  const config = {
    headers: { Authorization: token },
  };

  // console.log(`Token found! {${token}}`)
  // console.log("Removing blog")
  // console.table(blogToBeRemoved)

  const response = await axios.delete(
    `${baseUrl}/${blogToBeRemoved.id}`,
    config
  );
  return response.status;
};

const blogService = {
  setToken,
  getAll,
  getAllFromAuthor,
  getBlog,
  create,
  update,
  updateComment,
  remove,
};
export default blogService;
