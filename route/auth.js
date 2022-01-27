const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const {connectToDatabase} = require('../config/config');

const JWT_SECRET = process.env.JWT_SECRET


//REGISTER
router.post('/register', async (req, res) => {
	try {
        await connectToDatabase()
	const { username, password: plainTextPassword,email,phone} = req.body
  if(phone.length<10 && phone.length>10){
    return res.json({ status: false, error: 'Invalid Phone' })
  }
	if (!email || typeof email !== 'string') {
		return res.json({ status: false, error: 'Invalid username' })
	}
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: false, error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: false,
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
		const response = await User.create({username,password,email,phone})
        res.status(200).json({message:"User add Successgull",result:response})
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: false, error: 'Username already in use' })
		}

	return res.status(401).json({
        status:false,
        message:error.message
    })
	}
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        await connectToDatabase()
        const { email, password } = req.body
        console.log(email);
        const user = await User.findOne({ email }).lean()  
        if (!user) {
            return res.json({ status: false, error: 'Invalid email/password' })
        }
    
        if (await bcrypt.compare(password, user.password)) {
            // the email, password combination is successful
    
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email
                },
                JWT_SECRET,
                {expiresIn:'1h'}
            )
              const{password, ...others}= user
            return res.json({ status: true, token: token,result:others })
        }
        
    } catch (error) {
         return res.json({ status: false, error: error.message })
        
    }
})

router.post('/date',async(req,res)=>{
  try {
    await connectToDatabase()
    let date = new Date();
    let year = date.getFullYear();
    let  month = date.getMonth()+1;
    let day = date.getDate();
     
     if (day < 10) {
       day = '0' + dt;
     }
     if (month < 10) {
       month = '0' + month;
     } 
     let dates = year+month+day
     console.log(year+'-' + month + '-'+day);
     const response = await temp.create({$set:dates})
     console.log(response)
     return res.status(200).json(response)
  } catch (error) {
    
   return res.status(401).json(error.message)
  }



})


module.exports = router;