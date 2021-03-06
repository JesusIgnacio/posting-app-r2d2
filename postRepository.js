const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://mongo:27017/';

var mongoClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
 
const dbName = 'test';

exports.store = async (data) => {
  const connection = await mongoClient.connect();
  const db = await connection.db(dbName);
  const collection = await db.collection('posts');
  data.map(post =>{
    let p = setPost(post);
    if (p != null){
      collection.updateOne(
        { story_id: p.story_id, story_state: true },
        {$set:
          { 
          story_id:     p.story_id,
          story_author: p.story_author,
          story_title: p.story_title,
          story_url:    p.story_url,
          created_at:   p.created_at,
          story_state:  p.story_state 
          }
        },{ upsert: true } , function(err){
        if (err){
          console.log('Post save fails', err);
        }
      });
    }
  })
  connection.close();
  return true;
}

exports.list = async () => {
  const connection = await mongoClient.connect();
  const db = connection.db(dbName);
  const collection = db.collection('posts');
  let data;
  const response = await collection.find({story_state: true}).sort({created_at: -1}).toArray()
                          .then(out => data = out)
                          .then(() => connection.close())
  return data;
}

exports.deactivate = async (id) => {
  let deactivated = false;
  const connection = await mongoClient.connect();
  const db = connection.db(dbName);
  const collection = db.collection('posts');
  let data;
  collection.updateOne({story_id: Number(id)}, [{$set: {story_state: false}}], function(err, result){
                        if (err){
                          console.log('Post deactivate fails', err);
                        }else{
                          console.log('Post deactivate succesfully');
                        }
                      });
  return data;
}


function setPost(post){
  if ((post.story_title != null || post.title !=null) && (post.story_url != null || post.url != null) && post.story_id != null){
    var auxPost = {
      story_id: String,
      story_author: String,
      story_title: String,
      story_url: String,
      created_at: String,
      story_state: Boolean
    };
    auxPost.story_id = post.story_id,
    auxPost.story_author = post.author,
    auxPost.story_title = (post.story_title || post.title),
    auxPost.story_url = (post.story_url || post.url),
    auxPost.created_at = post.created_at,
    auxPost.story_state = true
    return auxPost;
  }
  return null;
}