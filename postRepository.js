const MongoClient = require("mongodb").MongoClient;

const URL_DATABASE = ''

var model = require("./postModel");
var mongoClient = new MongoClient(URL_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

exports.store = (data) => {
  mongoClient.connect(err => {
    if (err){
      console.log('Unable to connect to database', err);
    } else {
      console.log('Connected to database 1');
      const collection = mongoClient.db('test').collection('posts') ;
      data.map(post => {
        var auxPost = {
          story_id:String,
          story_title:String,
          story_url:String,
          created_at:String,
          story_state:Boolean
        };
        if ((post.story_title != null || post.title !=null) && !findPost(post) ){
          auxPost.story_id = post.story_id;
          auxPost.story_tittle = (post.story_title || post.title);
          auxPost.story_url = post.url;
          auxPost.created_at = post.created_at;
          auxPost.story_state = true;
          collection.insertOne(auxPost, function(err){
            if (err){
              console.log('Post save fails', err);
            }
          })
        }
      });
      mongoClient.close();
    }
  });
}

exports.list = () => {
  mongoClient.connect(err => {
    if (err){
      console.log('Unable to connect to database', err);
    } else {
      console.log('Connected to database 2');
      const collection = mongoClient.db('test').collection('posts') ;
      console.log(collection.find({story_state: true}))
      collection.find({story_state: true}).toArray(function(err, result) {
        if (err){
          console.log('Post List Fails');
        }else {
          console.log('Post List Succesfully');
          mongoClient.close();
          return result;
        }
      })
    }
  });
}

exports.deactivate = (id) => {
  mongoClient.connect(URL_DATABASE, function(err, db) {
    if (err){
      console.log('Unable to connect to database', err);
    } else {
      console.log('Connected to database');
      var collection = db('test').collection('posts') ;
      collection.update({story_id: id}, {$set: {story_state: false}}).toArray(function(err, result) {
        if (err){
          console.log('Post Deactive Fails');
        }else {
          console.log('Post Deactive Succesfully');
        }
      })
    }
  });
}

function findPost(post)  {
  return false;
}