const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

//get all users
exports.getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find({})
        return res.status(200).send({
            userCount: users.length,
            success: true,
            message: "All users data",
            users
        })
    }
    catch(err){
        // console.log(err);
        return res.status(500).send({
            message: 'Error in get users callback',
            success: false,
            err
        })
    }
}

//register user
exports.registerUser = async (req, res) => {
    try{
        const { username, email, password } = req.body
        //validation
        if(!username || !email || !password){
            return res.status(400).send({
                message: 'Please fill all fields',
                success: false
            })
        }
        //existing user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(401).send({
                message: 'User already exists',
                success: false
            })
        }
        //save new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({username, email, password: hashedPassword})
        await user.save()
        return res.status(201).send({
            message: 'New user created',
            success: true,
            user
        })
    }
    catch(err){
        // console.log(err);
        return res.status(500).send({
            message: 'Error in register callback',
            success: false,
            err
        })
    }
}

//login user
exports.loginUser = async (req, res) => {
    try{
        const { email, password } = req.body
        //validation
        if(!email || !password){
            return res.status(401).send({
                message: "Please provide correct email and password",
                success: false
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(401).send({
                message: "User is not registered",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).send({
                message: "Invalid username or password",
                success: false
            })
        }
        return res.status(200).send({
            message: "Login successful",
            success: true,
            user
        })
    }
    catch(err){
        // console.log(err);
        return res.status(500).send({
            message: 'Error in login callback',
            success: false,
            err
        })
    }
}