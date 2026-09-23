import { useNavigate } from "react-router-dom";

import {
    FaShieldAlt,
    FaSearch,
    FaExclamationTriangle,
    FaLock,
    FaEnvelope,
    FaComments,
    FaTachometerAlt
} from "react-icons/fa";

import "../styles/home.css";


function Home() {

    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="hero-section">

                <div className="hero-content">

                    {/* HERO BADGE */}
                    <div className="hero-badge">
                        <FaShieldAlt />
                        AI-POWERED DEFENCE
                    </div>


                    {/* HERO TITLE */}
                    <h1>
                        Protect Your Digital World
                        <span> With CYBERGUARD</span>
                    </h1>


                    {/* HERO DESCRIPTION */}
                    <p>
                        AI-powered cyber threat, phishing and digital
                        impersonation detection and response system.
                    </p>


                    {/* =================================================
                        DASHBOARD BUTTON
                    ================================================= */}

                    <button
                        className="dashboard-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        <FaTachometerAlt />
                        Dashboard
                    </button>


                    {/* =================================================
                        HERO ACTION BUTTONS
                    ================================================= */}

                    <div className="hero-buttons">

                        {/* START ANALYSIS */}
                        <button
                            className="primary-btn"
                            onClick={() => navigate("/analyze")}
                        >
                            Start Analysis
                        </button>


                        {/* DETECT THREAT */}
                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/detect")}
                        >
                            Detect Threat
                        </button>


                        {/* PHISHING SCANNER */}
                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/phishing")}
                        >
                            Phishing Scanner
                        </button>

                    </div>

                </div>


                {/* =================================================
                    HERO SHIELD
                ================================================= */}

                <div className="hero-shield">

                    <div className="shield-circle">
                        <FaShieldAlt />
                    </div>

                </div>

            </section>


            {/* =====================================================
                FEATURES SECTION
            ===================================================== */}

            <section className="features-section">

                {/* SECTION HEADING */}

                <div className="section-heading">

                    <span>
                        CYBERGUARD
                    </span>

                    <h2>
                        Intelligent Cyber Defence
                    </h2>

                    <p>
                        Detect, analyze and respond to evolving
                        cybersecurity threats.
                    </p>

                </div>


                {/* =================================================
                    FEATURE GRID
                ================================================= */}

                <div className="feature-grid">


                    {/* =================================================
                        DETECT
                    ================================================= */}

                    <div
                        className="feature-card"
                        onClick={() => navigate("/detect")}
                    >

                        <div className="feature-icon">
                            <FaSearch />
                        </div>

                        <h3>
                            Detect
                        </h3>

                        <p>
                            Identify suspicious URLs, phishing attempts
                            and malicious cyber activities.
                        </p>

                        <span>
                            Explore →
                        </span>

                    </div>


                    {/* =================================================
                        ANALYZE
                    ================================================= */}

                    <div
                        className="feature-card"
                        onClick={() => navigate("/analyze")}
                    >

                        <div className="feature-icon">
                            <FaExclamationTriangle />
                        </div>

                        <h3>
                            Analyze
                        </h3>

                        <p>
                            Analyze threats using intelligent risk
                            scoring and evidence-based detection.
                        </p>

                        <span>
                            Analyze →
                        </span>

                    </div>


                    {/* =================================================
                        RESPOND
                    ================================================= */}

                    <div
                        className="feature-card"
                        onClick={() => navigate("/respond")}
                    >

                        <div className="feature-icon">
                            <FaLock />
                        </div>

                        <h3>
                            Respond
                        </h3>

                        <p>
                            Take appropriate security actions against
                            detected threats and incidents.
                        </p>

                        <span>
                            Respond →
                        </span>

                    </div>


                    {/* =================================================
                        PROTECT
                    ================================================= */}

                    <div
                        className="feature-card"
                        onClick={() => navigate("/protect")}
                    >

                        <div className="feature-icon">
                            <FaShieldAlt />
                        </div>

                        <h3>
                            Protect
                        </h3>

                        <p>
                            Strengthen your digital security with
                            proactive cybersecurity protection.
                        </p>

                        <span>
                            Protect →
                        </span>

                    </div>


                    {/* =================================================
                        EMAIL ANALYZER
                    ================================================= */}

                    <div
                        className="feature-card email-feature-card"
                        onClick={() => navigate("/email-analyzer")}
                    >

                        <div className="feature-icon">
                            <FaEnvelope />
                        </div>

                        <h3>
                            Email Analyzer
                        </h3>

                        <p>
                            Analyze suspicious emails and detect
                            phishing and social engineering indicators.
                        </p>

                        <span>
                            Analyze Email →
                        </span>

                    </div>


                    {/* =================================================
                        MESSAGE ANALYZER
                    ================================================= */}

                    <div
                        className="feature-card message-feature-card"
                        onClick={() => navigate("/message-analyzer")}
                    >

                        <div className="feature-icon">
                            <FaComments />
                        </div>

                        <h3>
                            Message Analyzer
                        </h3>

                        <p>
                            Detect social engineering, scam messages,
                            suspicious requests and malicious links.
                        </p>

                        <span>
                            Analyze Message →
                        </span>

                    </div>

                </div>

                <div
    className="feature-card"
    onClick={() => navigate("/image-analyzer")}
>
    <div className="feature-icon">
        🖼️
    </div>

    <h3>Image Analyzer</h3>

    <p>
        Detect AI-generated, manipulated and suspicious images.
    </p>

    <span>
        Analyze Image →
    </span>
</div>

<div
    className="feature-card"
    onClick={() => navigate("/voice-analyzer")}
>
    <div className="feature-icon">
        🎙️
    </div>

    <h3>Voice Analyzer</h3>

    <p>
        Detect AI-generated, cloned and manipulated voice recordings.
    </p>

    <span>
        Analyze Voice →
    </span>
</div>

            </section>


            {/* =====================================================
                STATS SECTION
            ===================================================== */}

            <section className="stats-section">


                {/* THREAT DETECTION */}

                <div className="stat-card">

                    <h2>
                        99.9%
                    </h2>

                    <p>
                        Threat Detection
                    </p>

                </div>


                {/* MONITORING */}

                <div className="stat-card">

                    <h2>
                        24/7
                    </h2>

                    <p>
                        Monitoring
                    </p>

                </div>


                {/* AI */}

                <div className="stat-card">

                    <h2>
                        AI
                    </h2>

                    <p>
                        Powered Analysis
                    </p>

                </div>


                {/* RISK LEVELS */}

                <div className="stat-card">

                    <h2>
                        5
                    </h2>

                    <p>
                        Risk Levels
                    </p>

                </div>

                


            </section>


        </div>
    );
}


export default Home;