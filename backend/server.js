import sequelize from "./config/db.js";
import "./models/index.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5001;

try{
    await sequelize.authenticate();
    await sequelize.sync();
}
catch(error){
    console.log("Error is ",error);
}
console.log("Database is connected and tables are ready!");
app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
})