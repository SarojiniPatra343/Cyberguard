import { useState } from "react";
import { analyzeEmail } from "../services/api";
import "../styles/EmailAnalyzer.css";

function EmailAnalyzer() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!email.trim()) {
            setError("Please enter email content.");
            setResult(null);
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await analyzeEmail(email);
            setResult(data);
        } catch (err) {
            setError(
                err.message || "Unable to analyze email."
            );
        } finally {
            setLoading(false);
        }
    };

    const clearAnalysis = () => {
        setEmail("");
        setResult(null);
        setError("");
    };

    return (
        <div className="email-page">

            <div className="email-container">

                {/* HEADER */}
                <div className="email-header">
                    <div className="email-icon">
                        ✉
                    </div>

                    <div>
                        <h1>Email Phishing Analyzer</h1>

                        <p>
                            Analyze suspicious emails and detect
                            phishing and social engineering indicators.
                        </p>
                    </div>
                </div>


                {/* INPUT CARD */}
                <div className="email-card">

                    <label>
                        Email Content
                    </label>

                    <textarea
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Paste suspicious email content here..."
                    />

                    <div className="email-actions">

                        <button
                            className="analyze-email-btn"
                            onClick={handleAnalyze}
                            disabled={loading}
                        >
                            {loading
                                ? "Analyzing..."
                                : "Analyze Email"}
                        </button>

                        <button
                            className="clear-email-btn"
                            onClick={clearAnalysis}
                        >
                            Clear
                        </button>

                    </div>

                </div>


                {/* ERROR */}
                {error && (
                    <div className="email-error">
                        ⚠ {error}
                    </div>
                )}


                {/* RESULT */}
                {result && (
                    <div className="email-result">

                        <div className="result-title">
                            <h2>
                                Analysis Result
                            </h2>

                            <span
                                className={`risk-badge ${result.risk?.toLowerCase()}`}
                            >
                                {result.risk}
                            </span>
                        </div>


                        {/* RESULT STATS */}
                        <div className="email-stats">

                            <div className="email-stat">
                                <span>
                                    Risk Score
                                </span>

                                <strong>
                                    {result.score}/100
                                </strong>
                            </div>


                            <div className="email-stat">
                                <span>
                                    Confidence
                                </span>

                                <strong>
                                    {result.confidence}%
                                </strong>
                            </div>


                            <div className="email-stat">
                                <span>
                                    Detection
                                </span>

                                <strong
                                    className={
                                        result.is_phishing
                                            ? "danger-text"
                                            : "safe-text"
                                    }
                                >
                                    {result.is_phishing
                                        ? "PHISHING"
                                        : "NO THREAT"}
                                </strong>
                            </div>

                        </div>


                        {/* EVIDENCE */}
                        <div className="email-section">

                            <h3>
                                🔎 Evidence Detected
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

                                <p className="no-evidence">
                                    No major suspicious indicators
                                    were detected.
                                </p>

                            )}

                        </div>


                        {/* RECOMMENDED ACTION */}
                        <div className="recommendation">

                            <h3>
                                🛡 Recommended Action
                            </h3>

                            <p>
                                {result.recommended_action}
                            </p>

                        </div>


                        {/* DATABASE ID */}
                        {result.database_id && (
                            <div className="database-info">
                                ✓ Analysis saved to MongoDB
                            </div>
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default EmailAnalyzer;