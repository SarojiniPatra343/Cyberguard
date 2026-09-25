
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [countryCode, setCountryCode] = useState("+91");
    const [mobile, setMobile] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const countries = [
        { name: "India", code: "+91", flag: "🇮🇳" },
        { name: "United States", code: "+1", flag: "🇺🇸" },
        { name: "Canada", code: "+1", flag: "🇨🇦" },
        { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
        { name: "Australia", code: "+61", flag: "🇦🇺" },
        { name: "New Zealand", code: "+64", flag: "🇳🇿" },
        { name: "Germany", code: "+49", flag: "🇩🇪" },
        { name: "France", code: "+33", flag: "🇫🇷" },
        { name: "Italy", code: "+39", flag: "🇮🇹" },
        { name: "Spain", code: "+34", flag: "🇪🇸" },
        { name: "Portugal", code: "+351", flag: "🇵🇹" },
        { name: "Netherlands", code: "+31", flag: "🇳🇱" },
        { name: "Belgium", code: "+32", flag: "🇧🇪" },
        { name: "Switzerland", code: "+41", flag: "🇨🇭" },
        { name: "Austria", code: "+43", flag: "🇦🇹" },
        { name: "Sweden", code: "+46", flag: "🇸🇪" },
        { name: "Norway", code: "+47", flag: "🇳🇴" },
        { name: "Denmark", code: "+45", flag: "🇩🇰" },
        { name: "Finland", code: "+358", flag: "🇫🇮" },
        { name: "Ireland", code: "+353", flag: "🇮🇪" },
        { name: "Poland", code: "+48", flag: "🇵🇱" },
        { name: "Greece", code: "+30", flag: "🇬🇷" },
        { name: "Russia", code: "+7", flag: "🇷🇺" },
        { name: "Ukraine", code: "+380", flag: "🇺🇦" },

        { name: "China", code: "+86", flag: "🇨🇳" },
        { name: "Japan", code: "+81", flag: "🇯🇵" },
        { name: "South Korea", code: "+82", flag: "🇰🇷" },
        { name: "Singapore", code: "+65", flag: "🇸🇬" },
        { name: "Malaysia", code: "+60", flag: "🇲🇾" },
        { name: "Indonesia", code: "+62", flag: "🇮🇩" },
        { name: "Thailand", code: "+66", flag: "🇹🇭" },
        { name: "Vietnam", code: "+84", flag: "🇻🇳" },
        { name: "Philippines", code: "+63", flag: "🇵🇭" },
        { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
        { name: "Pakistan", code: "+92", flag: "🇵🇰" },
        { name: "Nepal", code: "+977", flag: "🇳🇵" },
        { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
        { name: "Bhutan", code: "+975", flag: "🇧🇹" },
        { name: "Maldives", code: "+960", flag: "🇲🇻" },

        { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
        { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
        { name: "Qatar", code: "+974", flag: "🇶🇦" },
        { name: "Kuwait", code: "+965", flag: "🇰🇼" },
        { name: "Oman", code: "+968", flag: "🇴🇲" },
        { name: "Bahrain", code: "+973", flag: "🇧🇭" },
        { name: "Israel", code: "+972", flag: "🇮🇱" },
        { name: "Turkey", code: "+90", flag: "🇹🇷" },

        { name: "South Africa", code: "+27", flag: "🇿🇦" },
        { name: "Egypt", code: "+20", flag: "🇪🇬" },
        { name: "Nigeria", code: "+234", flag: "🇳🇬" },
        { name: "Kenya", code: "+254", flag: "🇰🇪" },
        { name: "Ghana", code: "+233", flag: "🇬🇭" },
        { name: "Morocco", code: "+212", flag: "🇲🇦" },
        { name: "Algeria", code: "+213", flag: "🇩🇿" },
        { name: "Tunisia", code: "+216", flag: "🇹🇳" },
        { name: "Tanzania", code: "+255", flag: "🇹🇿" },
        { name: "Uganda", code: "+256", flag: "🇺🇬" },

        { name: "Brazil", code: "+55", flag: "🇧🇷" },
        { name: "Mexico", code: "+52", flag: "🇲🇽" },
        { name: "Argentina", code: "+54", flag: "🇦🇷" },
        { name: "Chile", code: "+56", flag: "🇨🇱" },
        { name: "Colombia", code: "+57", flag: "🇨🇴" },
        { name: "Peru", code: "+51", flag: "🇵🇪" },

        { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
        { name: "Albania", code: "+355", flag: "🇦🇱" },
        { name: "Algeria", code: "+213", flag: "🇩🇿" },
        { name: "Andorra", code: "+376", flag: "🇦🇩" },
        { name: "Angola", code: "+244", flag: "🇦🇴" },
        { name: "Armenia", code: "+374", flag: "🇦🇲" },
        { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
        { name: "Belarus", code: "+375", flag: "🇧🇾" },
        { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦" },
        { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
        { name: "Croatia", code: "+385", flag: "🇭🇷" },
        { name: "Cyprus", code: "+357", flag: "🇨🇾" },
        { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
        { name: "Estonia", code: "+372", flag: "🇪🇪" },
        { name: "Georgia", code: "+995", flag: "🇬🇪" },
        { name: "Hungary", code: "+36", flag: "🇭🇺" },
        { name: "Iceland", code: "+354", flag: "🇮🇸" },
        { name: "Latvia", code: "+371", flag: "🇱🇻" },
        { name: "Lithuania", code: "+370", flag: "🇱🇹" },
        { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
        { name: "Malta", code: "+356", flag: "🇲🇹" },
        { name: "Moldova", code: "+373", flag: "🇲🇩" },
        { name: "Monaco", code: "+377", flag: "🇲🇨" },
        { name: "Romania", code: "+40", flag: "🇷🇴" },
        { name: "Serbia", code: "+381", flag: "🇷🇸" },
        { name: "Slovakia", code: "+421", flag: "🇸🇰" },
        { name: "Slovenia", code: "+386", flag: "🇸🇮" },

        { name: "Jamaica", code: "+1-876", flag: "🇯🇲" },
        { name: "Bahamas", code: "+1-242", flag: "🇧🇸" },
        { name: "Barbados", code: "+1-246", flag: "🇧🇧" },
        { name: "Trinidad and Tobago", code: "+1-868", flag: "🇹🇹" }
    ];

    const handleRegister = (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !name ||
            !email ||
            !mobile ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (mobile.length < 6) {
            setError("Please enter a valid mobile number.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const fullMobileNumber = `${countryCode}${mobile}`;

        console.log("Registration Data:", {
            name,
            email,
            mobile: fullMobileNumber,
            password
        });

        setMessage("Registration successful!");

        setTimeout(() => {
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="register-page">

            <div className="register-background-glow"></div>

            <div className="register-card">

                <div className="register-logo">

                    <div className="register-logo-icon">
                        🛡️
                    </div>

                    <h1>CYBERGUARD</h1>

                    <p>AI-POWERED CYBER DEFENCE</p>

                </div>

                <h2>Create Account</h2>

                <p className="register-subtitle">
                    Create your CyberGuard account to get started
                </p>

                {error && (
                    <div className="register-error">
                        ⚠️ {error}
                    </div>
                )}

                {message && (
                    <div className="register-success">
                        ✓ {message}
                    </div>
                )}

                <form
                    className="register-form"
                    onSubmit={handleRegister}
                >

                    {/* Full Name */}
                    <div className="register-input-group">

                        <label>Full Name</label>

                        <div className="register-input-wrapper">

                            <span className="register-input-icon">
                                👤
                            </span>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    {/* Email */}
                    <div className="register-input-group">

                        <label>Email Address</label>

                        <div className="register-input-wrapper">

                            <span className="register-input-icon">
                                ✉
                            </span>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    {/* Country + Mobile */}
                    <div className="register-input-group">

                        <label>Mobile Number</label>

                        <div className="mobile-input-row">

                            <select
                                value={countryCode}
                                onChange={(e) =>
                                    setCountryCode(e.target.value)
                                }
                                className="country-select"
                            >
                                {countries.map((country, index) => (
                                    <option
                                        key={`${country.code}-${index}`}
                                        value={country.code}
                                    >
                                        {country.flag} {country.name} ({country.code})
                                    </option>
                                ))}
                            </select>

                            <input
                                className="mobile-number-input"
                                type="tel"
                                placeholder="Enter mobile number"
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="register-input-group">

                        <label>Password</label>

                        <div className="register-input-wrapper">

                            <span className="register-input-icon">
                                🔒
                            </span>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    {/* Confirm Password */}
                    <div className="register-input-group">

                        <label>Confirm Password</label>

                        <div className="register-input-wrapper">

                            <span className="register-input-icon">
                                🔐
                            </span>

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                    >
                        CREATE ACCOUNT
                        <span>→</span>
                    </button>

                </form>

                <div className="already-account">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        LOGIN
                    </button>

                </div>

                <button
                    type="button"
                    className="register-back-home"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>

            </div>

        </div>
    );
}

export default Register;

