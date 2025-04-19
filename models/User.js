import mongoose from 'mongoose'; 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    hobbie: {

        type: String,
        required: false
    }
});

// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);
export default User;
