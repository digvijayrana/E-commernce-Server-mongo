const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const {connectToDatabase} = require('../config/config')


//REGISTER
router.post('/register', async (req, res) => {
	try {
	const { username, password: plainTextPassword,email ,phone} = req.body

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

	
		const response = await User.create({
			nusername,password,email
		})
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

	res.json({ status: true,message:'successfull' })
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        await  connectToDatabase()
        const user = await User.findOne(
            {
                userName: req.body.user_name
            }
        );
        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        originalPassword != inputPassword &&
            res.status(401).json("Wrong Password");
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;