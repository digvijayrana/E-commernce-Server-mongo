const router = require('express').Router()
const helper = require('../utils/verifyToken')

router.post('/',helper.authenticateToken,(req,res)=>{
  return  res.send('verify')
})

router.post('/update-password', helper.authenticateToken, async (req, res) => {
    await connectToDatabase()
    const {  newpassword: plainTextPassword, email } = req.body
    let user = await employee.findOne({ email }).lean()
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
      return res.json({ status: 'error', error: 'Invalid password' })
    }
  
    if (plainTextPassword.length < 5) {
      return res.json({
        status: 'error',
        error: 'Password too small. Should be atleast 6 characters'
      })
    }
  
    if (!user) {
      res.status(401).json({ message: 'User not found' })
    }
  
    try {
      let subject = 'Updated Password', text =' Updated Password is '
      const salt = await bcrypt.genSalt(10);
      let pass = await bcrypt.hash(plainTextPassword, salt);
      let updatedData = {
        password: pass
      }
      let updatePassword = await employee.findByIdAndUpdate(user._id, { $set: updatedData })
      await mailservice(plainTextPassword,subject,text)
  
      res.status(200).json({ message: " Update  successfull" })
    } catch (error) {
      res.status(401).json({ status: 'error', error: error.message })
    }
  })
  

module.exports = router