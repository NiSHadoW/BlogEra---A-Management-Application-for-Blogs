import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Blogs = sequelize.define("Blogs",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blogTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blog: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: "blogs",
    timestamps: true,
});

export default Blogs