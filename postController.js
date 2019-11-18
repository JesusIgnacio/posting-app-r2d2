const fetch = require('node-fetch')

const POST_URL_BASE = 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs';

var postRepository = require("./postRepository");

exports.index =  async function(req, res, next) {
  try {
    const response =  await fetch(`${POST_URL_BASE}`);
    const data =  await response.json();
    postRepository.store(data.hits);
    const posts = await fetch(postRepository.list());
    console.log(posts);
    res.json({
      status: 0,
      message: "Posts retrieved successfully",
      data: posts
    });
  } catch (err) {
    res.json({
      status: 1,
      message: err,
    });
  }
}

exports.delete = async function(req, res, next) {
  try {
    const { id } = req.params;
    postRepository.deactivate(id);
    res.json({
      status: 0,
      message: "Post has deleted successfully"
    });
  } catch (err) {
    res.json({
      status: 1,
      message: err,
    });
  }
}