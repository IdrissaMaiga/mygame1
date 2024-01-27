const mongoose=require("mongoose")
messageSchema = new mongoose.Schema(
{ socket_id: {
    type:String,
    require:true
},
  room_id: {
    type:String,
    require:true
},

  message_single:{
    type:String,
    require:true
},
  sent_time:{
    type:String,
    require:true
},

},
{timestamps:true})

messagemodel= mongoose.model("message",messageSchema)  
module.exports={messagemodel}