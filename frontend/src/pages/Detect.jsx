import { useState } from "react";
import {
    FaShieldAlt,
    FaSearch,
    FaLink,
    FaExclamationTriangle,
    FaBrain,
    FaCheckCircle,
    FaDatabase
} from "react-icons/fa";

import { detectPhishing } from "../services/api";
import "../styles/detector.css";


function Detect() {

    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // DETECT PHISHING
    // ==========================================

    const handleDetect = async () => {

        if (!input.trim()) {
            setError("Please enter a URL");
            setResult(null);
            return;
        }

        try {

            setLoading(true);
            setError("");
            setResult(null);

            const data = await detectPhishing(input.trim());

            setResult(data);

        } catch (error) {

            setError(
                error.message ||
                "Phishing detection failed"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // CLEAR
    // ==========================================

    const handleClear = () => {

        setInput("");
        setResult(null);
        setError("");

    };


    // ==========================================
    // RISK CLASS
    // ==========================================

    const getRiskClass = (risk) => {

        if (!risk) {
            return "";
        }

        return `risk-${risk.toLowerCase()}`;

    };


    return (

        <div className="detector-page">

            <div className="detector-container">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="detector-header">

                    <div className="detector-icon">
                        <FaShieldAlt />
                    </div>

                    <h1>
                        CYBERGUARD Threat Detector
                    </h1>

                    <p>
                        Detect phishing URLs and suspicious cyber
                        threats using AI-powered machine learning
                        analysis.
                    </p>

                </div>


                {/* ==================================
                    DETECTOR CARD
                ================================== */}

                <div className="detector-card">

                    <div className="detector-title">

                        <FaSearch />

                        <div>

                            <h2>
                                Phishing Detection
                            </h2>

                            <p>
                                Enter a suspicious URL below for
                                intelligent security analysis.
                            </p>

                        </div>

                    </div>


                    <label>
                        Suspicious URL
                    </label>


                    <div className="url-input-wrapper">

                        <FaLink />

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError("");
                            }}
                            placeholder="https://example.com/login"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleDetect();
                                }
                            }}
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="detector-actions">

                        <button
                            className="detect-btn"
                            onClick={handleDetect}
                            disabled={loading}
                        >

                            <FaSearch />

                            {loading
                                ? "Scanning..."
                                : "Detect Threat"}

                        </button>


                        <button
                            className="clear-btn"
                            onClick={handleClear}
                            disabled={loading}
                        >
                            Clear
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="detector-error">

                            <FaExclamationTriangle />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}

                </div>


                {/* ==================================
                    RESULT
                ================================== */}

                {result && (

                    <div className="detection-result">


                        {/* RESULT HEADER */}

                        <div className="result-heading">

                            <FaShieldAlt />

                            <div>

                                <h2>
                                    Detection Result
                                </h2>

                                <p>
                                    CYBERGUARD security analysis completed
                                </p>

                            </div>

                        </div>


                        {/* ==================================
                            DETECTION STATUS
                        ================================== */}

                        <div className="detection-status">

                            <div
                                className={
                                    result.is_phishing
                                        ? "status-danger"
                                        : "status-safe"
                                }
                            >

                                {result.is_phishing ? (
                                    <>
                                        <FaExclamationTriangle />
                                        <span>
                                            PHISHING DETECTED
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle />
                                        <span>
                                            URL APPEARS SAFE
                                        </span>
                                    </>
                                )}

                            </div>

                        </div>


                        {/* ==================================
                            RESULT GRID
                        ================================== */}

                        <div className="detection-grid">


                            {/* THREAT */}

                            <div className="detection-box">

                                <span>
                                    Threat
                                </span>

                                <strong>
                                    {result.threat_type ||
                                        result.threat ||
                                        "Phishing"}
                                </strong>

                            </div>


                            {/* RISK */}

                            <div className="detection-box">

                                <span>
                                    Risk Level
                                </span>

                                <strong
                                    className={getRiskClass(
                                        result.risk
                                    )}
                                >
                                    {result.risk || "Unknown"}
                                </strong>

                            </div>


                            {/* RISK SCORE */}

                            <div className="detection-box">

                                <span>
                                    Risk Score
                                </span>

                                <strong>
                                    {result.risk_score ??
                                        result.score ??
                                        "N/A"}
                                </strong>

                            </div>


                            {/* CONFIDENCE */}

                            <div className="detection-box">

                                <span>
                                    Confidence
                                </span>

                                <strong>
                                    {result.confidence !== undefined
                                        ? `${result.confidence}%`
                                        : "N/A"}
                                </strong>

                            </div>


                        </div>


                        {/* ==================================
                            ML ANALYSIS
                        ================================== */}

                        {(result.ml_probability !== undefined ||
                            result.ml_prediction !== undefined) && (

                            <div className="detection-section ml-section">

                                <div className="section-title-row">

                                    <FaBrain />

                                    <h3>
                                        Machine Learning Analysis
                                    </h3>

                                </div>


                                <div className="ml-analysis-grid">


                                    <div className="ml-box">

                                        <span>
                                            ML Prediction
                                        </span>

                                        <strong>

                                            {result.ml_prediction === 1
                                                ? "PHISHING"
                                                : "LEGITIMATE"}

                                        </strong>

                                    </div>


                                    <div className="ml-box">

                                        <span>
                                            Phishing Probability
                                        </span>

                                        <strong>
                                            {result.ml_probability !== undefined
                                                ? `${result.ml_probability}%`
                                                : "N/A"}
                                        </strong>

                                    </div>


                                </div>

                            </div>

                        )}


                        {/* ==================================
                            EVIDENCE
                        ================================== */}

                        {(result.evidence ||
                            result.reasons) && (

                            <div className="detection-section">

                                <div className="section-title-row">

                                    <FaSearch />

                                    <h3>
                                        Detection Evidence
                                    </h3>

                                </div>


                                <ul>

                                    {(
                                        result.evidence ||
                                        result.reasons ||
                                        []
                                    ).map(
                                        (item, index) => (

                                            <li key={index}>
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </div>

                        )}


                        {/* ==================================
                            RECOMMENDED ACTION
                        ================================== */}

                        {result.recommended_action && (

                            <div className="detection-section">

                                <div className="section-title-row">

                                    <FaShieldAlt />

                                    <h3>
                                        Recommended Action
                                    </h3>

                                </div>

                                <p>
                                    {result.recommended_action}
                                </p>

                            </div>

                        )}


                        {/* ==================================
                            DATABASE STATUS
                        ================================== */}

                        {result.database_id && (

                            <div className="database-status">

                                <FaDatabase />

                                <span>
                                    Analysis result saved successfully
                                    to CYBERGUARD MongoDB
                                </span>

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


export default Detect;