const User=require('../models/user')
const {hashpassword ,comparePassword}=require('../helpers/auth')
const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');

    const test=(req,res)=>{
        res.json('test is working')
    }
        //register endpoint hna
    const registerUser=async (req,res)=>{
        try {
            const{name ,email,password,role}=req.body
           const exist= await User.findOne({email})
           if(exist){
              return res.json({
                error: 'email is taken already'
           })
           }
           const hashedPassword=await hashpassword(password)
           
           const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role
           })
           return res.json(user)
        } catch (error) {
          
           console.log(error)
        }
    }

    //login endpoint 

    const loginUser = async (req, res) => {
        console.log('Login request received');
        try {
          const { email, password } = req.body;
          
          // Check if the user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.json({
              error: 'No user found',
            });
          }
      
          console.log('Stored hashed password:', user.password);
          console.log('Input password:', password);
          
          // Compare the input password with the stored hashed password
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            console.log('Passwords match');
            
            // Generate JWT token
            jwt.sign(
              { email: user.email, id: user._id, name: user.name, role: user.role },
              process.env.JWT_SECRET,
              { expiresIn: '1h' }, // Optional: Set token expiration time
              (err, token) => {
                if (err) {
                  console.error('Error generating token:', err);
                  return res.status(500).json({ error: 'Error generating token' });
                }
      
                console.log('Token generated, sending response...');
                console.log('user id:', user._id);
                console.log('token:', token);
                // Send the token as a cookie and return user data
                res.cookie('token', token, { 
                  httpOnly: true, 
                  sameSite: 'lax', 
                  maxAge: 3600000 // Optional: Set cookie expiration time (1 hour)
                }).json({ 
                  message: 'Login successful', 
                  user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                  }
                });
              }
            );
          } else {
            console.log('Passwords do not match');
            return res.json({
              error: 'Invalid credentials',
            });
          }
        } catch (error) {
          console.error('Error during login:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
      };
      
      
      const getProfile = async (req, res) => {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
      
        if (!token) {
          return res.status(401).json({ error: 'Access Denied: No token provided' });
        }
      
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          // Fetch the user by ID
          const user = await User.findById(decoded.id); // Use decoded.id from JWT token
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          // Send the user data, including the ID
          res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        } catch (err) {
          console.error('Error verifying token:', err);
          res.status(403).json({ error: 'Invalid or expired token' });
        }
      };
      const logout=(req,res)=>{
        res.clearCookie('token');
        return res.json({ message: 'Logout successful' });
      }
      const getAllUsers = async (req, res) => {
        try {
          const users = await User.find({}, 'id name email role'); 
          res.json(users);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch users' });
        }
      };
    module.exports={
        test,
        registerUser,
        loginUser,
        getProfile,
        logout,
        getAllUsers
    }