 // Import dependencies
import express from 'express';   
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';     
import User from './models/User.js';


// Load environment variables from .env file
dotenv.config();

// creating the express app 
const app = express();

// middleware to parse data format
app.use(express.json());

// Connect to MongoDB using the URI from the environment variable
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,        // using the parser and topology to ensure better connection to mongodb
  useUnifiedTopology: true,     
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
 
 // defining the routes

// GET: Return all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Find all users
        res.json(users); // Send the users as a response
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});

// POST: Add  all users to the database at once using bulk
app.post('/users/bulk', async (req, res) => {
    try {
      console.log("Received body:", JSON.stringify(req.body, null, 2));
      if (!Array.isArray(req.body)) {
        return res.status(400).send("Body must be an array of users.");
      }
  
      const users = await User.insertMany(req.body, { ordered: true });
      res.status(201).json(users);
    } catch (err) {
      console.error("Insert failed:", err.message);
      res.status(400).json({ error: err.message });
    }
  });
  
  
  

// PUT: Edit a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from the URL parameter
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }); // Update the user
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser); // Return the updated user
    } catch (err) {
        res.status(500).send('Error updating user');
    }
});

// DELETE: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from the URL parameter
        const deletedUser = await User.findByIdAndDelete(id); // Delete the user
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted'); // Confirm deletion
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});

mongoose.connection.on('connected', () => {
    console.log(' MongoDB connected');
  
    // Start the server ONLY AFTER MongoDB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  });
  
  mongoose.connection.on('error', err => {
    console.error(' MongoDB connection error:', err);
  });
  
