const router = require('express').Router()
const helper = require('../utils/verifyToken')
const bcrypt = require('bcryptjs')
const User = require("../model/User");
const { connectToDatabase } = require('../config/config');
//edit 
router.post('/update-password', helper.authenticateToken, async (req, res) => {
  await connectToDatabase()
  const { newpassword: plainTextPassword, email } = req.body
  let user = await User.findOne({ email }).lean()
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
    const salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(plainTextPassword, salt);
    let updatedData = {
      password: pass
    }
    let updatePassword = await User.findByIdAndUpdate(user._id, { $set: updatedData })
    res.status(200).json({ message: " Update  successfull" })
  } catch (error) {
    res.status(401).json({ status: 'error', error: error.message })
  }
})


router.delete("/:id",helper.verifyTokenAndAuthorization, async (req, res) => {
  try {
    await connectToDatabase()
    const user = await User.findById(req.params.id);
    return res.status(200).json("Delete Successfull")
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/find/:id", helper.verifyTokenAndAdmin, async (req, res) => {
  try {
    await connectToDatabase()
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/getAll", helper.verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stats", helper.verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router