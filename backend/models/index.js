import Users from "./users.model.js";
import Blogs from "./blogs.model.js";

Users.hasMany(Blogs, { foreignKey: "userId" });
Blogs.belongsTo(Users, { foreignKey: "userId", as: "author" });

export { Users, Blogs };
