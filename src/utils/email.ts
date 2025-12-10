
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = 'service_0xb72sk';
const PUBLIC_KEY = '-21CUXRB9jrOlxbhb';

// Template IDs
const TEMPLATE_ID_OTP = 'template_j4rge99';
const TEMPLATE_ID_RESET = 'template_jwy0mai';

// Initialize EmailJS
export const initEmailJS = () => {
    try {
        emailjs.init(PUBLIC_KEY);
        console.log("EmailJS Initialized with key:", PUBLIC_KEY);
    } catch (error) {
        console.error("EmailJS Init Error:", error);
    }
};

// Generate a 6-digit OTP
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

interface SendOTPParams {
    email: string;
    name: string;
    otp: string;
}

// Send OTP for Registration
export const sendRegistrationOTP = async ({ email, name, otp }: SendOTPParams): Promise<boolean> => {
    try {
        const templateParams = {
            to_email: email,
            email: email, // Fallback
            reply_to: email, // Common fallback
            to_name: name,
            name: name, // Fallback
            passcode: otp,
            otp_code: otp,
            message: `Your verification code is: ${otp}`,
            time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        console.log("Attempting to send OTP email to:", email, "with params:", templateParams);
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_OTP, templateParams, PUBLIC_KEY);
        console.log('OTP Email sent successfully:', response);
        return true;
    } catch (error: any) {
        console.error('Failed to send OTP email:', error);
        if (error.text) {
            console.error('EmailJS Error Text:', error.text);
        }
        return false;
    }
};

// Send OTP for Password Reset
export const sendPasswordResetOTP = async ({ email, name, otp }: SendOTPParams): Promise<boolean> => {
    try {
        const templateParams = {
            to_email: email,
            email: email, // Fallback
            reply_to: email, // Fallback
            to_name: name || 'User',
            name: name || 'User', // Fallback
            passcode: otp,
            otp_code: otp, // Fallback
            message: `Your password reset code is: ${otp}`, // Fallback
            time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID_RESET, templateParams, PUBLIC_KEY);
        console.log('Reset Password Email sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Failed to send reset email:', error);
        return false;
    }
};
