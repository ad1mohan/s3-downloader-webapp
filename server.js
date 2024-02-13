const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
const s3 = new AWS.S3();

// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const bucket_name = process.env.BUCKET_NAME;
console.log("Bucket name:", bucket_name);

// Define route to fetch objects from S3 bucket
app.get('/objects', (req, res) => {
  const params = {
    Bucket: bucket_name
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching objects from S3');
    }

    const objects = data.Contents.map(obj => obj.Key);
    res.json(objects);
  });
});

// Define route to get list of items in S3 bucket
app.get('/items', async (req, res) => {
    const params = {
      Bucket: bucket_name
    };
  
    try {
      const data = await s3.listObjectsV2(params).promise();
      res.json(data.Contents);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
  

//    Define route to download item from S3
app.get('/download/:key', async (req, res) => {
const params = {
      Bucket: bucket_name,
      Key: req.params.key
};
  
    try {
      const data = await s3.getObject(params).promise();
      res.attachment(req.params.key);
      res.send(data.Body);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// Define root endpoint to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
