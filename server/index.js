import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import connectDB from './config/mongoose.js';
import cloudinary from './config/cloudinaryConfig.js';
import Synagogue from './models/synagogue.js';
 

connectDB();  

const app = express(); 
app.use(cors());
app.use(express.json());

// Signature Api
app.post('/get-signature', (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
  
    const params = {
      timestamp: timestamp,
      folder: 'torah-scrolls'
    };
  
    // Generate the signature
    const signature = cloudinary.utils.api_sign_request(params, cloudinary.config().api_secret );
  
    res.json({
      signature,
      timestamp,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name,
    });
  });

app.post('/synagogue', async (req, res) => {
    console.log(req.body)
    // const synagogue = new Synagogue({
    //     name: req.body.name
    // })
    // await synagogue.save();
}); 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));