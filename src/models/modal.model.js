const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modalSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    credit:{
      type: String,
      required: true
    }
   
  },
  { timestamps: true }
);

modalSchema.index({
  name: 1,
});

module.exports = mongoose.model("Modals", modalSchema);
