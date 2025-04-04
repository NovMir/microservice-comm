// src/components/Posts/PostList.jsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS, GET_POSTS_BY_CATEGORY } from './queries';
import PostCard from './postcard';
import Loading from './loading';
import ErrorAlert from './error';

const PostList = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Get all posts or filter by category
  const { loading, error, data } = useQuery(
    activeCategory === 'all' ? GET_POSTS : GET_POSTS_BY_CATEGORY,
    {
      variables: activeCategory === 'all' ? {} : { category: activeCategory },
      fetchPolicy: 'network-only', // Don't use cache for this query
    }
  );

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={`Error loading posts: ${error.message}`} />;

  // Get the posts from the appropriate query result
  const posts = activeCategory === 'all' ? data.posts : data.postsByCategory;

  return (
    <div className="post-list">
      <div className="category-filter" style={{ marginBottom: '20px' }}>
        <button 
          className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleCategoryChange('all')}
          style={{ marginRight: '10px' }}
        >
          All
        </button>
        <button 
          className={`btn ${activeCategory === 'news' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleCategoryChange('news')}
          style={{ marginRight: '10px' }}
        >
          News
        </button>
        <button 
          className={`btn ${activeCategory === 'discussion' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleCategoryChange('discussion')}
        >
          Discussions
        </button>
      </div>

      {posts.length === 0 ? (
        <p>No posts found. Be the first to create a post!</p>
      ) : (
        <div className="grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;