const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  plaidItems: [
    {
      itemId: String,
      accessToken: String,        // Never expose to client
      institutionName: String,
      institutionId: String,
      lastSynced: Date,
    },
  ],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never return the password or plaid access tokens
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.plaidItems = (obj.plaidItems || []).map(({ accessToken, ...safe }) => safe);
  return obj;
};

module.exports = mongoose.model('User', userSchema);
