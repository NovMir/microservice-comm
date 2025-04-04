
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from './dateFormatter';

const Postcard = ({ post }) => {
  // Truncate content if it's too long
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="card">
      <div className="card-title">
        <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {post.title}
        </Link>
      </div>
      
      <div className="card-subtitle">
        <span>
          Posted by {post.author?.username || 'Anonymous'} | {formatDate(post.createdAt)}
        </span>
        <span className={`badge ${post.category === 'news' ? 'badge-primary' : 'badge-warning'}`} style={{ marginLeft: '10px' }}>
          {post.category}
        </span>
      </div>
      
      <div className="card-content">
        {truncateContent(post.content)}
      </div>
      
      <div className="card-footer">
        <Link to={`/posts/${post.id}`} className="btn btn-outline">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Postcard;