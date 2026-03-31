import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    }, // Not required for Google login
    roles: {
        type: [String],
        enum: ['user', 'vendor', 'admin'],
        default: ['user']
    },
    activeRole: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user'
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    } // sparse index for unique but optional
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);