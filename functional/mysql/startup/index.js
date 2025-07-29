require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// custom require
const error = require('../middleware/v1/error');
const i18n = require('../config/v1/i18n');  

module.exports = async function (app) {
  console.log('Loading startup files!');

// Middleware to parse URL-encoded form data
  app.use(express.urlencoded({ extended: true }))

  // parse application/json
  app.use(express.json({limit: '50mb'}));

  // Enable Cross-Origin Resource Sharing (CORS)
  app.use(cors({
    headers: "*",
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    origin: "*",
    credentials: true
  }))

  // Secure HTTP headers: Content-Security-Policy, X-Frame-Options, etc.
  app.use(helmet());

  // Initialize i18n middleware
  app.use(i18n.init);

  // Define the static file path
  app.use('/public', express.static('public'));
  app.use('/uploads', express.static('uploads'));
  
  // Set up ejs template engine to render html
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../', 'views'));
  
  // Route setup (awaited)
  await require('./routes')(app);

  // Synchronizing all models at once
  await require('./models')

  // Error middleware
  app.use(error);
}