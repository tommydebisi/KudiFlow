const redisClient = require('../utils/redis');

exports.confirmPass = async (req, res, next) => {
  // get new password and confirm password
  const { newPassword, confirmPassword, resetToken } = req.body;

  if (!newPassword) return res.status(400).json({ error: 'Newpassword absent' });
  if (!confirmPassword) return res.status(400).json({ error: 'Confirm password absent' });

  if (newPassword !== confirmPassword) return res.status(400).json({ error: 'Passwords are not same' });

  // validate the reset token
  const userId = await redisClient.get(`reset_${resetToken}`);

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  req.newPass = newPassword;
  req.userId = userId;
  next();
}
