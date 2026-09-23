// ============================================================
// CYBERGUARD - PRODUCTION API CONFIGURATION
// ============================================================

const API_URL = "https://cyberguard-backend-dewc.onrender.com/api";


// ============================================================
// THREAT ANALYSIS
// ============================================================

export const analyzeThreat = async (input, type = "URL") => {
    const response = await fetch(
        `${API_URL}/threats/analyze`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input,
                type,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Threat analysis failed"
        );
    }

    return data;
};


// ============================================================
// PHISHING DETECTION
// ============================================================

export const detectPhishing = async (url) => {
    const response = await fetch(
        `${API_URL}/phishing/detect`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Phishing detection failed"
        );
    }

    return data;
};


// ============================================================
// RESPONSE ACTION
// ============================================================

export const executeResponse = async (
    action,
    threat = "Unknown",
    target = "Unknown"
) => {
    const response = await fetch(
        `${API_URL}/response/execute`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                threat,
                target,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Response action failed"
        );
    }

    return data;
};


// ============================================================
// THREAT HISTORY
// ============================================================

export const getThreatHistory = async () => {
    const response = await fetch(
        `${API_URL}/threats/history`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to fetch threat history"
        );
    }

    return data;
};


// ============================================================
// EMAIL ANALYSIS
// ============================================================

export const analyzeEmail = async (email) => {
    const response = await fetch(
        `${API_URL}/email/analyze`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Email analysis failed"
        );
    }

    return data;
};


// ============================================================
// MESSAGE ANALYSIS
// ============================================================

export const analyzeMessage = async (message) => {
    const response = await fetch(
        `${API_URL}/message/analyze`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Message analysis failed"
        );
    }

    return data;
};


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

export const getDashboardStats = async () => {
    const response = await fetch(
        `${API_URL}/dashboard/stats`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to load dashboard statistics"
        );
    }

    return data;
};


// ============================================================
// LOGIN
// EMAIL + PASSWORD
// ============================================================

export const loginUser = async (email, password) => {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.trim(),
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Invalid email or password"
        );
    }

    return data;
};


// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (
    name,
    email,
    mobile,
    password
) => {
    const response = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                mobile: mobile.trim(),
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Registration failed"
        );
    }

    return data;
};


// ============================================================
// FORGOT PASSWORD
// ============================================================

export const sendForgotPasswordOTP = async (mobile) => {
    const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mobile: mobile.trim(),
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to send OTP"
        );
    }

    return data;
};


// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPassword = async (
    mobile,
    otp,
    newPassword
) => {
    const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mobile: mobile.trim(),
                otp: otp.trim(),
                new_password: newPassword,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Password reset failed"
        );
    }

    return data;
};