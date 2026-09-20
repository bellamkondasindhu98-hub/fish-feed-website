function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Strip common spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-()]/g, '');
    // Allow +91XXXXXXXXXX or 10-digit Indian numbers (6-9 followed by 9 digits) or generic 10-15 digit phone
    return /^(\+?\d{1,4})?\d{10}$/.test(cleaned);
}

function isValidPassword(password) {
    if (!password || typeof password !== 'string') return false;
    // At least 6 characters
    return password.length >= 6;
}

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidPassword
};
