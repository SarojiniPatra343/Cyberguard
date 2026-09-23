import { useState } from "react";
import { FaShieldAlt, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { analyzeThreat } from "../services/api";
import "../styles/analyzer.css";

function Analyze() {
    const [input, setInput] = useState("");
    const [type, setType] = useState("URL");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!input.trim()) {
            setError("Please enter a URL or text to analyze.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await analyzeThreat(input, type);
            setResult(data);
        } catch (err) {
            setError(err.message || "Unable to analyze the input.");
        } finally {
            setLoading(false);
        }
    };

    const getRiskClass = () => {
        if (!result) return "";

        return `risk-${result.risk.toLowerCase()}`;
    };

    return (
        <div className="analyzer-page">

            <div className="analyzer-wrapper">

                {/* HEADER */}
                <div className="analyzer-header">

                    <div className="analyzer-icon">
                        <FaShieldAlt />
                    </div>

                    <h1>CYBERGUARD Threat Analyzer</h1>

                    <p>
                        Analyze suspicious URLs and messages using
                        intelligent cybersecurity detection.
                    </p>

                </div>


                {/* ANALYZER CARD */}
                <div className="analyzer-card">

                    <div className="type-buttons">

                        <button
                            className={type === "URL" ? "active-type" : ""}
                            onClick={() => {
                                setType("URL");
                                setResult(null);
                                setError("");
                            }}
                        >
                            <FaSearch />
                            URL Analysis
                        </button>

                        <button
                            className={type === "TEXT" ? "active-type" : ""}
                            onClick={() => {
                                setType("TEXT");
                                setResult(null);
                                setError("");
                            }}
                        >
                            <FaExclamationTriangle />
                            Text Analysis
                        </button>

                    </div>


                    <label>
                        {type === "URL"
                            ? "Enter URL to analyze"
                            : "Enter suspicious message or text"}
                    </label>


                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            type === "URL"
                                ? "https://example.com/login"
                                : "Example: Your account has been suspended. Click here to verify..."
                        }
                    />


                    <button
                        className="analyze-main-btn"
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? "Analyzing Threat..." : "Analyze Threat"}
                    </button>


                    {error && (
                        <div className="analyzer-error">
                            {error}
                        </div>
                    )}

                </div>


                {/* RESULT */}
                {result && (

                    <div className="analysis-result">

                        <div className="result-title">
                            <FaShieldAlt />
                            <h2>Analysis Result</h2>
                        </div>


                        <div className="result-grid">

                            <div className="result-box">
                                <span>Threat Type</span>
                                <strong>
                                    {result.threat_type}
                                </strong>
                            </div>


                            <div className="result-box">
                                <span>Risk Level</span>

                                <strong className={getRiskClass()}>
                                    {result.risk}
                                </strong>
                            </div>


                            <div className="result-box">
                                <span>Risk Score</span>

                                <strong>
                                    {result.risk_score}
                                </strong>
                            </div>


                            <div className="result-box">
                                <span>Confidence</span>

                                <strong>
                                    {result.confidence}%
                                </strong>
                            </div>

                        </div>


                        {/* EVIDENCE */}
                        <div className="result-section">

                            <h3>🔎 Detection Evidence</h3>

                            <ul>

                                {result.evidence?.map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul>

                        </div>


                        {/* ACTION */}
                        <div className="result-section action-section">

                            <h3>🛡 Recommended Action</h3>

                            <p>
                                {result.recommended_action}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Analyze;