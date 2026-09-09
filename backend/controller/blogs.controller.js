import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  searchBlogsByTitle,
  filterBlogsByCategory,
  searchAndFilterBlogs,
  getBlogById,
} from "../services/blogs.services.js";

//Creating new blog for an user - (Admin, User)
export const createBlogHandler = async (req, res) => {
  const { blogTitle, blog, category } = req.body;

  try {
    const newBlog = await createBlog(req.user.id, { blogTitle, blog, category });
    res.status(201).json({
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Updating a blog for an user - (Admin, User)
export const updateBlogHandler = async (req, res) => {
  const blogId = Number(req.params.id);
  //Checking validity of blogId from api end before reaching database
  if (!blogId)
  {
    return res.status(400).json({
      message: "Invalid blog id"
    });
  }

  const { blogTitle, blog, category } = req.body;

  try {
    const updatedBlog = await updateBlog(blogId, req.user, { blogTitle, blog, category });
    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Deleting a blog - (Admin, User)
export const deleteBlogHandler = async (req, res) => {
  const blogId = Number(req.params.id);
  if (!blogId)
  {
    return res.status(400).json({
      message: "Invalid blog id"
    });
  }

  try {
    await deleteBlog(blogId, req.user);
    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//View all blogs by any user - (Admin, User, Guest)
export const getBlogsHandler = async (req, res) => {
  const { title, category } = req.query;

  try {
    let blogs;

    //Search and filter blogs with title and category
    if (title && category) {
      blogs = await searchAndFilterBlogs(title, category);
    } 
    //Search blogs with title
    else if (title) {
      blogs = await searchBlogsByTitle(title);
    }
    //Search blogs with category 
    else if (category) {
      blogs = await filterBlogsByCategory(category);
    } 
    //Show all blogs
    else {
      blogs = await getAllBlogs();
    }

    res.status(200).json({
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};

//Get blogs by ID - (Admin, User)
export const getBlogByIdHandler = async (req, res) => {
  const blogId = Number(req.params.id);
  if (!blogId) 
  {
    return res.status(400).json({ 
      message: "Invalid blog id" 
    });
  }

  try {
    const blog = await getBlogById(blogId);
    res.status(200).json({
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
};
