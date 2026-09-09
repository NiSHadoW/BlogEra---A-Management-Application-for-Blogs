export const validateBlogFields = (blogTitle, blog, category) => {
    return Boolean(blogTitle && blog && category);
}
