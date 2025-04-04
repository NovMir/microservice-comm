// src/schemas/HelpRequestSchema.js
const mongoose = require('mongoose');

// Define the help request schema
const HelpReqSchema = new mongoose.Schema({
  // Reference to the user who created the help request
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // References the User model
    required: true
  },
  // Description of the help needed
  description: {
    type: String,
    required: true
  },
  // Whether the request has been resolved
  isResolved: {
    type: Boolean,
    default: false
  },
  // Array of users who volunteered to help
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

// Update the updatedAt field when document is modified
HelpReqSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Create and export the model
const HelpRequest = mongoose.model('HelpRequest', HelpReqSchema);
module.exports = HelpRequest;