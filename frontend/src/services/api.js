// ============================================================
// CYBERGUARD - PRODUCTION API CONFIGURATION
// ============================================================

// ============================================================
// FASTAPI BACKEND
// Threat detection, phishing, email, message, dashboard, etc.
// ============================================================

const API_URL =
    "https://cyberguard-backend-dewc.onrender.com/api";


// ============================================================
// DJANGO AUTH BACKEND
// Register + Login + User Database
// ============================================================

// LOCAL DEVELOPMENT
const DJANGO_API_URL =
    "https://cyberguard-mmor.onrender.com/api";


// ============================================================
// THREAT ANALYSIS
// ============================================================

export const analyzeThreat = async (
    input,
    type = "URL"
) => {

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
            data.detail ||
            "Threat analysis failed"
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
            data.detail ||
            "Phishing detection failed"
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
            data.detail ||
            "Response action failed"
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
            data.detail ||
            "Unable to fetch threat history"
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
            data.detail ||
            "Email analysis failed"
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
            data.detail ||
            "Message analysis failed"
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
            data.detail ||
            "Unable to load dashboard statistics"
        );
    }

    return data;
};


// ============================================================
// LOGIN
// DJANGO
// EMAIL + PASSWORD
// ============================================================

export const loginUser = async (
    email,
    password
) => {

    try {

        const response = await fetch(
            `${DJANGO_API_URL}/login/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email: email
                        .trim()
                        .toLowerCase(),

                    password,
                }),
            }
        );

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "Invalid response from Django server."
            );
        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                data.detail ||
                "Invalid email or password."
            );
        }

        return data;

    } catch (error) {

        console.error(
            "Login API Error:",
            error
        );

        throw error;
    }
};


// ============================================================
// REGISTER
// DJANGO
// ============================================================



export const registerUser = async (userData) => {
    const response = await fetch(
        `${DJANGO_API_URL}/register/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const message =
            data?.message ||
            data?.errors?.email?.[0] ||
            data?.errors?.mobile?.[0] ||
            "Registration failed.";

        throw new Error(message);
    }

    return data;
};
