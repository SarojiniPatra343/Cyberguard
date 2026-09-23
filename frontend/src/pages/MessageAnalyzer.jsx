import { useState } from "react";
import { FaComments, FaShieldAlt, FaTrash, FaSearch } from "react-icons/fa";

import { analyzeMessage } from "../services/api";

import "../styles/MessageAnalyzer.css";


function MessageAnalyzer() {

    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleAnalyze = async () => {

        if (!message.trim()) {

            setError("Please enter a message to analyze.");

            setResult(null);

            return;
        }


        setLoading(true);

        setError("");

        setResult(null);


        try {

            const data = await analyzeMessage(message);

            setResult(data);

        } catch (err) {

            setError(
                err.message ||
                "Unable to analyze message."
            );

        } finally {

            setLoading(false);

        }
    };


    const clearMessage = () => {

        setMessage("");

        setResult(null);

        setError("");
    };


    return (

        <div className="message-page">

            <div className="message-container">


                {/* ================= HEADER ================= */}

                <div className="message-header">

                    <div className="message-icon">

                        <FaComments />

                    </div>


                    <div>

                        <div className="message-label">
                            CYBERGUARD • SOCIAL ENGINEERING DEFENCE
                        </div>

                        <h1>
                            Message Analyzer
                        </h1>

                        <p>
                            Analyze suspicious SMS, chat messages and
                            social engineering attempts using intelligent
                            threat analysis.
                        </p>

                    </div>

                </div>


                {/* ================= INPUT CARD ================= */}

                <div className="message-card">

                    <div className="card-heading">

                        <FaComments />

                        <div>

                            <h2>
                                Analyze Suspicious Message
                            </h2>

                            <p>
                                Paste an SMS, chat message or suspicious
                                communication below.
                            </p>

                        </div>

                    </div>


                    <label>
                        Message Content
                    </label>


                    <textarea
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Example: URGENT! Your bank account has been suspended. Click here to verify your OTP immediately..."
                    />


                    <div className="message-actions">

                        <button
                            className="message-analyze-btn"
                            onClick={handleAnalyze}
                            disabled={loading}
                        >

                            <FaSearch />

                            {loading
                                ? "Analyzing..."
                                : "Analyze Message"
                            }

                        </button>


                        <button
                            className="message-clear-btn"
                            onClick={clearMessage}
                        >

                            <FaTrash />

                            Clear

                        </button>

                    </div>

                </div>


                {/* ================= ERROR ================= */}

                {error && (

                    <div className="message-error">

                        ⚠

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ================= RESULT ================= */}

                {result && (

                    <div className="message-result">


                        {/* RESULT HEADER */}

                        <div className="result-header">

                            <div>

                                <span className="result-label">
                                    THREAT ANALYSIS
                                </span>

                                <h2>
                                    Analysis Result
                                </h2>

                            </div>


                            <span
                                className={`message-risk-badge ${result.risk?.toLowerCase()}`}
                            >
                                {result.risk}
                            </span>

                        </div>


                        {/* STATS */}

                        <div className="message-stats">


                            <div className="message-stat">

                                <span>
                                    Risk Score
                                </span>

                                <strong>
                                    {result.score}/100
                                </strong>

                            </div>


                            <div className="message-stat">

                                <span>
                                    Confidence
                                </span>

                                <strong>
                                    {result.confidence}%
                                </strong>

                            </div>


                            <div className="message-stat">

                                <span>
                                    Detection
                                </span>

                                <strong
                                    className={
                                        result.is_threat
                                            ? "danger-text"
                                            : "safe-text"
                                    }
                                >
                                    {result.is_threat
                                        ? "THREAT DETECTED"
                                        : "NO THREAT"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* EVIDENCE */}

                        <div className="message-section">

                            <h3>
                                🔎 Suspicious Indicators
                            </h3>


                            {result.reasons &&
                            result.reasons.length > 0 ? (

                                <ul>

                                    {result.reasons.map(
                                        (reason, index) => (

                                            <li key={index}>
                                                {reason}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p className="no-message-evidence">

                                    No major suspicious indicators
                                    were detected.

                                </p>

                            )}

                        </div>


                        {/* RECOMMENDATION */}

                        <div className="message-recommendation">

                            <div className="recommendation-icon">

                                <FaShieldAlt />

                            </div>


                            <div>

                                <h3>
                                    Recommended Action
                                </h3>

                                <p>
                                    {result.recommended_action}
                                </p>

                            </div>

                        </div>


                        {/* DATABASE */}

                        {result.database_id && (

                            <div className="message-database">

                                ✓ Analysis saved to MongoDB

                            </div>

                        )}

                    </div>

                )}

            </div>

        </div>

    );
}


export default MessageAnalyzer;