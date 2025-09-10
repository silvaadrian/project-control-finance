const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório."],
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      unique: true,
      match: [/.+@.+\..+/, "Por favor, insira um email válido."],
    },
    password: {
      type: String,
      required: [true, "A senha é obrigatória."],
      minlength: [6, "A senha deve ter pelo menos 6 caracteres."],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
