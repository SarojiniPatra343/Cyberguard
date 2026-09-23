import { useState } from "react";
import {
    FaShieldAlt,
    FaLink,
    FaExclamationTriangle,
    FaCheckCircle,
    FaSearch
} from "react-icons/fa";

import { detectPhishing } from "../services/api";
import "../styles/phishing.css";

function Phishing() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleScan = async () => {
        if (!url.trim()) {
            setError("Please enter a URL.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await detectPhishing(url);
            setResult(data);
        } catch (err) {
            setError(
                err.message || "Unable to connect to CYBERGUARD server."
            );
        } finally {
            setLoading(false);
        }
    };

    const getRiskClass = () => {
        if (!result?.risk) return "";

        return `phishing-risk-${result.risk.toLowerCase()}`;
    };

    return (
        <div className="phishing-page">

            <div className="phishing-container">

                {/* Header */}
                <div className="phishing-header">

                    <div className="phishing-shield">
                        <FaShieldAlt />
                    </div>

                    <h1>Phishing Detection</h1>

                    <p>
                        Detect suspicious and potentially malicious URLs
                        using CYBERGUARD intelligent threat analysis.
                    </p>

                </div>


                {/* Scanner Card */}
                <div className="phishing-card">

                    <div className="phishing-card-title">

                        <div className="phishing-title-icon">
                            <FaSearch />
                        </div>

                        <div>
                            <h2>Scan Suspicious URL</h2>

                            <p>
                                Enter a website URL to check whether it
                                contains phishing indicators.
                            </p>
                        </div>

                    </div>


                    <label>Website URL</label>

                    <div className="phishing-input-wrapper">

                        <FaLink />

                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/login"
                        />

                    </div>


                    <button
                        className="phishing-scan-btn"
                        onClick={handleScan}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="scan-spinner"></span>
                                Scanning...
                            </>
                        ) : (
                            <>
                                <FaShieldAlt />
                                Scan for Phishing
                            </>
                        )}
                    </button>


                    {error && (
                        <div className="phishing-error">
                            <FaExclamationTriangle />
                            <span>{error}</span>
                        </div>
                    )}

                </div>


                {/* Result */}
                {result && (
                    <div className="phishing-result">

                        <div className="phishing-result-header">

                            {result.is_phishing ? (
                                <FaExclamationTriangle />
                            ) : (
                                <FaCheckCircle />
                            )}

                            <h2>Phishing Scan Result</h2>

                        </div>


                        <div className="phishing-result-grid">

                            <div className="phishing-result-box">
                                <span>URL</span>
                                <strong className="url-result">
                                    {result.url}
                                </strong>
                            </div>


                            <div className="phishing-result-box">

                                <span>Risk Level</span>

                                <strong className={getRiskClass()}>
                                    {result.risk}
                                </strong>

                            </div>


                            <div className="phishing-result-box">

                                <span>Risk Score</span>

                                <strong>
                                    {result.score}
                                </strong>

                            </div>


                            <div className="phishing-result-box">

                                <span>Confidence</span>

                                <strong>
                                    {result.confidence}%
                                </strong>

                            </div>

                        </div>


                        {/* Status */}
                        <div
                            className={
                                result.is_phishing
                                    ? "phishing-status danger-status"
                                    : "phishing-status safe-status"
                            }
                        >

                            {result.is_phishing ? (
                                <>
                                    <FaExclamationTriangle />

                                    <div>
                                        <h3>Potential Phishing Detected</h3>

                                        <p>
                                            This URL contains suspicious
                                            indicators and should be treated
                                            with caution.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle />

                                    <div>
                                        <h3>No Major Phishing Indicators</h3>

                                        <p>
                                            No major suspicious indicators
                                            were detected in this scan.
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>


                        {/* Evidence */}
                        <div className="phishing-section">

                            <h3>
                                🔎 Detection Evidence
                            </h3>

                            {result.reasons?.length > 0 ? (
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
                                <p>
                                    No suspicious indicators were detected.
                                </p>
                            )}

                        </div>


                        {/* Action */}
                        <div className="phishing-action">

                            <h3>
                                🛡 Recommended Action
                            </h3>

                            <p>
                                {result.is_phishing
                                    ? "Block this URL and avoid entering passwords, OTPs, banking details, or other personal information."
                                    : "The URL appears safe based on the current analysis. Continue following normal cybersecurity precautions."
                                }
                            </p>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Phishing;