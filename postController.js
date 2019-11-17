const fetch = require('node-fetch')

const POST_URL_BASE = 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs'

exports.index =  async function(req, res, next) {
  try {
    const response =  await fetch(`${POST_URL_BASE}`);
    const data =  await response.json();
    const repos = JSON.stringify(data);
    //SET DATA TO DB
    //LIST DATA ACTIVE
    res.json({
      status: "success",
      message: "Posts retrieved successfully",
      data: data
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
    //Deactivate Post
    res.json({
      status: 0,
      message: "Post has deleted successfully",
      data: data
    });
  } catch (err) {
    res.json({
      status: 1,
      message: err,
    });
  }
}