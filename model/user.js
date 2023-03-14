const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide a name'],
        minLength: [3, 'the minimum length for name is 3']
    },
   email:{
    type: String,
    reguired: [true, 'Please provide an email'],
    unique: true,
    match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    , 'please provide a valid email']
   },
   password:{
    type: String,
    required: [true, 'Please provide a password'],
        minLength: [7, 'the minimum length for password is 7'],
   },
},
{timestamps:true})

userSchema.pre('save', async function (next){
    const salt= await bcrypt.genSalt();
    this.password = await bcrypt .hash (this.password, salt);
    next ();
})

userSchema.methods.generateToken =function () {
    return jwt.sign({userId: this._id, email:this.email}, process.env.JWT_SECRET, {expiresIn: '3d'})
}

userSchema.methods.comparePassword = async function (userPassword) {
    const isCorrect = await bcrypt.compare(userPassword, this.password)
    return isCorrect;
}

module.exports= mongoose.model('user', userSchema);