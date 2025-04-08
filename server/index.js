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

// create synagogue
app.post('/synagogue', async (req, res) => {
  try{
    const synagogue = new Synagogue( req.body )
    await synagogue.save();
  } catch (err) {
    console.log(err)
  }
});

// find user synagogues
app.get('/mySynagogues/:uid', async (req, res) => {
  try {
    const {uid} = req.params;
    const mySynagogues = await Synagogue.find({owner: uid});
    console.log(mySynagogues);
    res.json(mySynagogues);
  } catch (error) {
    console.error('Error fetching synagogues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// search for specific synagogues
app.get('/synagogueSearch', async (req, res) => {
  try {
    const { name, city, street} = req.query;

    // using name
    if (!city && !street){
      const foundSynagogues = await Synagogue.aggregate([
        {
          $search: {
            index: 'default',
            text: {
              query: name,
              path: 'name',
              fuzzy: { maxEdits: 1 }
            }
          }
        },
        { $limit: 10 }
      ]);
      res.json(foundSynagogues);
    }

    // using name, city and street
    else { 
      const searchCriteria = {
        index: 'default',
        compound: {
          should: [
            {
              text: {
                query: name,
                path: 'name',
                fuzzy: { maxEdits: 1 }
              }
            },
            {
              text: {
                query: city,
                path: 'city',
                fuzzy: { maxEdits: 1 }
              }
            },
            {
              text: {
                query: street,
                path: 'street',
                fuzzy: { maxEdits: 1 }
              }
            }
          ]
        }
      };
  
      const foundSynagogues = await Synagogue.aggregate([
        {
          $search: searchCriteria
        },
        { $limit: 5 }
      ]);
  
      res.json(foundSynagogues);
    }
  } catch (error) {
    console.error('Error fetching synagogues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// port config
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));