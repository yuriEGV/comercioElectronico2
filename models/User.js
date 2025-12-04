import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
name: {
type: String,
required: [true, 'Please provide name'],
},
email: {
type: String,
required: [true, 'Please provide email'],
unique: true,
},
password: {
type: String,
required: [true, 'Please provide password'],
},
role: {
type: String,
enum: ['user', 'admin'],
default: 'user',
},
});

const User = mongoose.model('User', UserSchema);

// Export default para ESModules
export default User;
