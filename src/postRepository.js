import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/';
const dbName = process.env.DB_NAME || 'test';

let client;
let db;

const connectDB = async () => {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log('📦 Connected to MongoDB');
  }
  return db;
};

const getCollection = async (collectionName) => {
  const database = await connectDB();
  return database.collection(collectionName);
};

export const store = async (data) => {
  try {
    const collection = await getCollection('posts');
    const validPosts = data.map(post => setPost(post)).filter(post => post !== null);
    
    if (validPosts.length === 0) {
      return true;
    }

    const bulkOps = validPosts.map(post => ({
      updateOne: {
        filter: { story_id: post.story_id },
        update: { $set: post },
        upsert: true
      }
    }));

    await collection.bulkWrite(bulkOps);
    console.log(`✅ Stored ${validPosts.length} posts`);
    return true;
  } catch (error) {
    console.error('❌ Error storing posts:', error);
    throw error;
  }
};

export const list = async () => {
  try {
    const collection = await getCollection('posts');
    const data = await collection
      .find({ story_state: true })
      .sort({ created_at: -1 })
      .toArray();
    
    return data;
  } catch (error) {
    console.error('❌ Error listing posts:', error);
    throw error;
  }
};

export const deactivate = async (id) => {
  try {
    const collection = await getCollection('posts');
    const result = await collection.updateOne(
      { story_id: Number(id) },
      { $set: { story_state: false } }
    );
    
    if (result.matchedCount === 0) {
      throw new Error(`Post with ID ${id} not found`);
    }
    
    console.log(`✅ Post ${id} deactivated successfully`);
    return result;
  } catch (error) {
    console.error('❌ Error deactivating post:', error);
    throw error;
  }
};

const setPost = (post) => {
  if (
    (post.story_title != null || post.title != null) &&
    (post.story_url != null || post.url != null) &&
    post.story_id != null
  ) {
    return {
      story_id: post.story_id,
      story_author: post.author || 'Unknown',
      story_title: post.story_title || post.title,
      story_url: post.story_url || post.url,
      created_at: post.created_at || new Date().toISOString(),
      story_state: true
    };
  }
  return null;
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('📦 MongoDB connection closed');
  }
  process.exit(0);
});