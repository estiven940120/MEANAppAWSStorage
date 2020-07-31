const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  label: { type: String, required: true, unique: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  scholarship: { type: String, default: "" },
  ocupation: { type: String, default: "" },
  age_dcl: { type: String, default: "" },
  age_dementia: { type: String, default: "" },
  content: { type: String, default: "" },
  records: { type: String, default: "" },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("Post", postSchema);
