const mongoose = require('mongoose');



// Define the community post schema
const CommPostSchema= new mongoose.Schema({
  // Reference to the user who created the post
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // References the User model in auth service
    required: true
  },
  // Title of the post
  title: {
    type: String,
    required: true,
    trim: true   // Remove whitespace from both ends
  },
  // Main content of the post
  content: {
    type: String,
    required: true
  },
  // Category of the post
  category: {
    type: String,
    required: true,
    enum: ['news', 'discussion'],   // Only allow these values
    default: 'discussion'
  },
  // AI-generated summary (optional)
  aiSummary: {
    type: String,
    default: null   // Will implement later
  },
  // Creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Last update timestamp
  updatedAt: {
    type: Date,
    default: null
  }
});

// Add a pre-save hook to update the updatedAt field
CommPostSchema.pre('save', function(next) {
  // Only update the timestamp if the document is being modified (not new)
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Create and export the model
const CommunityPost = mongoose.model('CommunityPost', CommPostSchema);
module.exports = CommunityPost;