import { registerUser, loginUser, forgotPassword, resetPassword } from "../services/auth.services.js";

export const signUp = async(req,res)=>{
    const {firstname, lastname, email, password} = req.body;
    try{
        const user = await registerUser({firstname, lastname, email, password});
        res.status(201).json({
            message: "User created successfully",
            data: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: "user",
                "isActive": true
            }
        })
    }
    catch(error)
    {
        res.status(error.statusCode || 500).json({
            message: error.message || "Server error!"
        })
    }
}

export const login = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const {token, user} = await loginUser({email,password});
        res.status(200).json({
            message: "Login successful!",
            data: {
                token, user: {
                    id:user.id,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            }
        })
    }
    catch(error)
    {
        res.status(error.statusCode || 500).json({
            message: error.message || "Server error"
        });
    }
}

export const forgotPasswordHandler = async(req, res)=>{
    const {email} = req.body;
    try{
        await forgotPassword(email);
        res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent."
        })
    }
    catch(error)
    {
        res.status(error.statusCode || 500).json({
            message: error.message || "Server error"
        });
    }
}

export const resetPasswordHandler = async(req, res)=>{
    const {token} = req.params;
    const {password} = req.body;
    try{
        await resetPassword(token, password);
        res.status(200).json({
            message: "Password successfully changed."
        })
    }
    catch(error)
    {
        res.status(error.statusCode || 500).json({
            message: error.message || "Server error"
        });
    }
}