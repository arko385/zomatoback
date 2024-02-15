const express = require('express')
const app = express()
const mongoose=require("mongoose");
const port = process.env.PORT||3000;
const User=require("./model/user");
const cors=require("cors");
app.use(cors());

//const monguri="mongodb://127.0.0.1:27017/mydb";
const monguri="mongodb+srv://ramkrishnasarkar12175:1GleQf4X7fTeyiWL@cluster0.gg9vkzf.mongodb.net/mydb?retryWrites=true&w=majority";
mongoose.connect(monguri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  

  })
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(error => console.error('MongoDB connection error:', error));
  
  app.use(express.json());

  app.post('/signup', async (req, res) => {
    const { name, email, password ,mobile} = req.body;

    // Validate inputs (use validator.js or similar)
    // ... validation logic

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Create new user
        const user = new User({ name, email, password,mobile});
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }


    if (password!==user.password) {
      return res.status(401).json({ error: 'Invalid  password' });
    }
    res.status(200).json({msg:'Login successful' }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/', (req, res) => {
res.send('Hello World!')
});



app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
});