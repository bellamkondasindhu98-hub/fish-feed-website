const bcrypt = require('bcryptjs');
const { UserModel } = require('../models');
const { generateToken } = require('../utils/jwt');
const { isValidEmail, isValidPhone, isValidPassword } = require('../utils/validators');

const authController = {
    // POST /api/auth/register
    register: (req, res, next) => {
        try {
            const { name, email, phone, password, confirmPassword } = req.body;

            // Validations
            if (!name || !email || !phone || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields: name, email, phone, and password.'
                });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email address.'
                });
            }

            if (!isValidPhone(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid 10-digit mobile number.'
                });
            }

            if (!isValidPassword(password)) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long.'
                });
            }

            if (confirmPassword && password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match. Please re-enter your password confirmation.'
                });
            }

            // Check if user already exists
            const existingEmail = UserModel.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this email address already exists. Please login instead.'
                });
            }

            const existingPhone = UserModel.findByPhone(phone);
            if (existingPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this mobile number already exists.'
                });
            }

            // Hash password
            const passwordHash = bcrypt.hashSync(password, 10);

            // Create user
            const newUser = UserModel.create({
                name,
                email,
                phone,
                passwordHash,
                role: 'CUSTOMER',
                profileImage: '/assets/images/user_avatar.svg'
            });

            // Generate JWT
            const token = generateToken(newUser);

            return res.status(201).json({
                success: true,
                message: 'Account registered successfully. Welcome to AquaGrow Feeds!',
                token,
                user: newUser
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/login
    login: (req, res, next) => {
        try {
            const { identifier, email, phone, password } = req.body;
            const loginId = identifier || email || phone;

            if (!loginId || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter both your email/mobile number and password.'
                });
            }

            const user = UserModel.findByEmailOrPhone(loginId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email/mobile number or password.'
                });
            }

            const isMatch = bcrypt.compareSync(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email/mobile number or password.'
                });
            }

            const token = generateToken(user);

            // Sanitized user object
            const safeUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            };

            return res.status(200).json({
                success: true,
                message: `Welcome back, ${user.name}!`,
                token,
                user: safeUser
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/auth/me
    getMe: (req, res) => {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    },

    // PUT /api/auth/profile
    updateProfile: (req, res, next) => {
        try {
            const { name, phone, profileImage } = req.body;
            if (phone && !isValidPhone(phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid mobile number.'
                });
            }

            const updatedUser = UserModel.updateProfile(req.user.id, {
                name,
                phone,
                profileImage
            });

            return res.status(200).json({
                success: true,
                message: 'Profile details updated successfully.',
                user: updatedUser
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/auth/change-password
    changePassword: (req, res, next) => {
        try {
            const { currentPassword, newPassword, confirmNewPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide both your current and new password.'
                });
            }

            if (!isValidPassword(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters long.'
                });
            }

            if (confirmNewPassword && newPassword !== confirmNewPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'New password confirmation does not match.'
                });
            }

            // Get user with passwordHash
            const userWithSecret = UserModel.findByEmail(req.user.email);
            const isMatch = bcrypt.compareSync(currentPassword, userWithSecret.passwordHash);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'The current password you entered is incorrect.'
                });
            }

            const newHash = bcrypt.hashSync(newPassword, 10);
            UserModel.updatePassword(req.user.id, newHash);

            return res.status(200).json({
                success: true,
                message: 'Password updated successfully. Please use your new password next time.'
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/auth/logout
    logout: (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully.'
        });
    }
};

module.exports = authController;
