import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(
                email.trim(),
                password
            );

            if (data.success) {
                // Save logged-in user
                localStorage.setItem(
                    "cyberguard_user",
                    JSON.stringify(data.user)
                );

                setMessage("Login successful!");

                // Go to Home page
                setTimeout(() => {
                    navigate("/");
                }, 800);
            } else {
                setError(
                    data.message ||
                    "Invalid email or password."
                );
            }

        } catch (error) {
            console.error("Login Error:", error);

            setError(
                error.message ||
                "Unable to connect to the login server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-background-glow"></div>

            <div className="login-card">

                {/* LOGO */}
                <div className="login-logo">

                    <div className="logo-icon">
                        🛡️
                    </div>

                    <h1>
                        CYBERGUARD
                    </h1>

                    <p>
                        AI-POWERED CYBER DEFENCE
                    </p>

                </div>


                {/* TITLE */}
                <h2>
                    Welcome Back
                </h2>

                <p className="login-subtitle">
                    Sign in to access your CyberGuard dashboard
                </p>


                {/* ERROR MESSAGE */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}


                {/* SUCCESS MESSAGE */}
                {message && (
                    <div className="success-message">
                        ✓ {message}
                    </div>
                )}


                {/* LOGIN FORM */}
                <form
                    onSubmit={handleLogin}
                    className="login-form"
                >

                    {/* EMAIL */}
                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                ✉
                            </span>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}
                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "LOGGING IN..."
                            : "LOGIN"
                        }

                        {!loading && (
                            <span>
                                →
                            </span>
                        )}

                    </button>

                </form>


                {/* REGISTER */}
                <div className="register-section">

                    <p>
                        Don't have an account?
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        CREATE ACCOUNT
                    </button>

                </div>


                {/* BACK HOME */}
                <button
                    type="button"
                    className="back-home"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    ← Back to Home
                </button>

            </div>

        </div>
    );
}

export default Login;