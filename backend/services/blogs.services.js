import { Op } from "sequelize";
import { Blogs, Users } from "../models/index.js";
import { validateBlogFields } from "../utils/validateBlog.js";

//Creating new blog for an user
export const createBlog = async (userId, { blogTitle, blog, category }) => {
  
  //Required fields validation
  if (!validateBlogFields(blogTitle, blog, category)) {
    const error = new Error("blogTitle, blog and category are required");
    error.statusCode = 400;
    throw error;
  }
  //Create new blog
  const newBlog = await Blogs.create({
    userId,
    blogTitle,
    blog,
    category,
  });

  return newBlog;
};

//Updating blog for an user
export const updateBlog = async (blogId, requestingUser, { blogTitle, blog, category }) => {
  //Finding blogId in database
  const existingBlog = await Blogs.findByPk(blogId);
  if (!existingBlog) {
    const error = new Error("Blog not found");
    error.statusCode = 404;
    throw error;
  }
  //Checking authorization in order to update a blog
  if (requestingUser.role !== "admin" && existingBlog.userId !== requestingUser.id) {
    const error = new Error("You are not authorized to update this blog.");
    error.statusCode = 403;
    throw error;
  }

  if (blogTitle !== undefined) 
  {
    existingBlog.blogTitle = blogTitle;
  }
  if (blog !== undefined) 
  {
    existingBlog.blog = blog;
  }
  if (category !== undefined) 
  {
    existingBlog.category = category;
  }
  await existingBlog.save();

  return existingBlog;
};

//Deleting a blog
export const deleteBlog = async (blogId, requestingUser) => {
  const existingBlog = await Blogs.findByPk(blogId);
  //Finding blogId in database
  if (!existingBlog) {
    const error = new Error("Blog not found");
    error.statusCode = 404;
    throw error;
  }
  //Checking authorization in order to delete a blog
  if (requestingUser.role !== "admin" && existingBlog.userId !== requestingUser.id) {
    const error = new Error("You are not authorized to delete this blog.");
    error.statusCode = 403;
    throw error;
  }

  await existingBlog.destroy();
};

//blogQueryOptions contains information from blogs table and user table which are connected with foreign key
const blogQueryOptions = {
  attributes: ["id", "blogTitle", "blog", "category", "createdAt", "updatedAt"],
  include: {
    model: Users,
    as: "author",
    attributes: ["id", "firstname", "lastname", "profileImage"],
  },
};

//Search and filter blogs with title and category
export const searchAndFilterBlogs = async (title, category) => {
  return Blogs.findAll({
    ...blogQueryOptions,//spread operator to append blogQueryOptions with matching title and category
    where: {
      blogTitle: { 
        [Op.like]: `%${title}%` //find blogs containing ${title} anywhere in the title. Partial matching
      },
      category, //include category
    },
  });
};

//Search blogs by title
export const searchBlogsByTitle = async (title) => {
  return Blogs.findAll({
    ...blogQueryOptions,
    where: { 
      blogTitle: { 
        [Op.like]: `%${title}%` 
      } 
    },
  });
};

//Filter blogs by category
export const filterBlogsByCategory = async (category) => {
  return Blogs.findAll({
    ...blogQueryOptions,
    where: { category },
  });
};

//Display all blogs
export const getAllBlogs = async () => {
  return Blogs.findAll(blogQueryOptions);
};

//Get blog by ID - (Admin, User)
export const getBlogById = async (id) => {
  const blog = await Blogs.findByPk(id, blogQueryOptions);

  if (!blog) {
    const error = new Error("Blog not found");
    error.statusCode = 404;
    throw error;
  }

  return blog;
};
