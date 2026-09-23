import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    sendForgotPasswordOTP,
    resetPassword
} from "../services/api";
import "../styles/ForgotPassword.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // OTP COUNTDOWN
    // ==========================================

    useEffect(() => {

        if (countdown <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setCountdown((previous) => previous - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [countdown]);


    // ==========================================
    // SEND OTP
    // ==========================================

    const handleSendOTP = async () => {

        setError("");
        setSuccess("");

        if (!mobile.trim()) {
            setError("Please enter your mobile number.");
            return;
        }

        if (!mobile.startsWith("+")) {
            setError(
                "Mobile number must include country code. Example: +919876543210"
            );
            return;
        }

        try {

            setLoading(true);

            const data = await sendForgotPasswordOTP(mobile);

            setOtpSent(true);

            // Start 60 second countdown
            setCountdown(60);

            setSuccess(
                data.message || "OTP sent successfully."
            );

        } catch (error) {

            setError(
                error.message || "Unable to send OTP."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        if (otp.length !== 6) {
            setError("OTP must contain 6 digits.");
            return;
        }

        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            const data = await resetPassword(
                mobile,
                otp,
                newPassword
            );

            setSuccess(
                data.message ||
                "Password reset successful."
            );

            // Clear fields
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");

            // Go to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {

            setError(
                error.message || "Password reset failed."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // RESEND OTP
    // ==========================================

    const handleResendOTP = async () => {

        if (countdown > 0) {
            return;
        }

        await handleSendOTP();
    };


    return (

        <div className="forgot-page">

            <div className="forgot-card">

                {/* LOGO / TITLE */}

                <div className="forgot-header">

                    <h1>CYBERGUARD</h1>

                    <p>
                        AI-POWERED CYBER SECURITY
                    </p>

                </div>


                {/* TITLE */}

                <div className="forgot-title">

                    <h2>
                        Forgot Password
                    </h2>

                    <p>
                        Reset your CyberGuard account password
                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="forgot-message error">

                        {error}

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="forgot-message success">

                        {success}

                    </div>

                )}


                {/* MOBILE */}

                <div className="forgot-field">

                    <label>
                        Mobile Number
                    </label>

                    <input
                        type="tel"
                        placeholder="+919876543210"
                        value={mobile}
                        onChange={(e) =>
                            setMobile(e.target.value)
                        }
                        disabled={otpSent}
                    />

                </div>


                {/* SEND OTP */}

                {!otpSent && (

                    <button
                        type="button"
                        className="forgot-button"
                        onClick={handleSendOTP}
                        disabled={loading}
                    >

                        {loading
                            ? "Sending OTP..."
                            : "Send OTP"
                        }

                    </button>

                )}


                {/* OTP + PASSWORD */}

                {otpSent && (

                    <form
                        onSubmit={handleResetPassword}
                    >

                        {/* OTP */}

                        <div className="forgot-field">

                            <label>
                                Enter OTP
                            </label>

                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                            />

                        </div>


                        {/* COUNTDOWN */}

                        <div className="otp-timer">

                            {countdown > 0 ? (

                                <span>
                                    Resend OTP in{" "}
                                    <strong>
                                        {countdown}
                                    </strong>{" "}
                                    seconds
                                </span>

                            ) : (

                                <span>
                                    Didn't receive the OTP?
                                </span>

                            )}

                        </div>


                        {/* RESEND */}

                        <button
                            type="button"
                            className="resend-button"
                            onClick={handleResendOTP}
                            disabled={
                                countdown > 0 ||
                                loading
                            }
                        >

                            {countdown > 0
                                ? `Resend OTP (${countdown}s)`
                                : "Resend OTP"
                            }

                        </button>


                        {/* NEW PASSWORD */}

                        <div className="forgot-field">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="forgot-field">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* RESET */}

                        <button
                            type="submit"
                            className="forgot-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"
                            }

                        </button>

                    </form>

                )}


                {/* BACK TO LOGIN */}

                <button
                    type="button"
                    className="back-login"
                    onClick={() =>
                        navigate("/login")
                    }
                >

                    ← Back to Login

                </button>

            </div>

        </div>
    );
}

export default ForgotPassword;