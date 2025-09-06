import * as postRepository from './postRepository.js';

const POST_URL_BASE = 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs';

export const index = async (req, res) => {
  try {
    const response = await fetch(`${POST_URL_BASE}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.hits || !Array.isArray(data.hits)) {
      throw new Error('Invalid data format received from API');
    }
    
    const stored = await postRepository.store(data.hits);
    let listPost = null;
    
    if (stored) {
      listPost = await postRepository.list();
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Posts retrieved successfully',
      data: listPost,
      count: listPost ? listPost.length : 0
    });
  } catch (err) {
    console.error('Error in index controller:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Internal server error',
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Post ID is required'
      });
    }
    
    const result = await postRepository.deactivate(id);
    
    res.status(200).json({
      status: 'success',
      message: 'Post has been deleted successfully'
    });
  } catch (err) {
    console.error('Error in delete controller:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Internal server error',
    });
  }
};

// For backward compatibility
export { deletePost as delete };