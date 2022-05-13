var _ = require('lodash')



const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = blogs.map(single => single.likes)
  return likes.reduce((sum, a) => sum + a, 0)
}

const favoriteBlog = (blogs) => {
  let max = blogs.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
  }) //returns object

  // let {_id, url, __v, ...max} = max
  delete max._id
  delete max.url
  delete max.__v

  return max
}

const mostBlogs = (blogs) => {
  let grouped_author = _.reduce(blogs, (result, single) => {
    console.log("result: ", result)
    console.log("single: ", single)
    (result[single.author] || (result[single.author] = [])).push(single)
    return result
  }, {})

  return grouped_author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}