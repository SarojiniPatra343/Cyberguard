import React, { useState } from "react";
import "../styles/voice-analyzer.css";

// ============================================================
// CYBERGUARD PRODUCTION API
// ============================================================

const API_URL =
    "https://cyberguard-backend-dewc.onrender.com/api";


// ============================================================
// VOICE ANALYZER
// ============================================================

const VoiceAnalyzer = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");


    // ========================================================
    // HANDLE AUDIO SELECTION
    // ========================================================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        setError("");
        setResult(null);

        if (!file) {
            setAudioFile(null);
            setAudioPreview("");
            return;
        }

        const allowedTypes = [
            "audio/mpeg",
            "audio/wav",
            "audio/x-wav",
            "audio/mp3",
            "audio/ogg",
            "audio/webm",
            "audio/mp4",
            "audio/x-m4a",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError(
                "Invalid audio format. Please upload MP3, WAV, OGG, WEBM or M4A."
            );

            setAudioFile(null);
            setAudioPreview("");
            return;
        }

        setAudioFile(file);

        const previewURL = URL.createObjectURL(file);
        setAudioPreview(previewURL);
    };


    // ========================================================
    // ANALYZE VOICE
    // ========================================================

    const handleAnalyze = async () => {
        if (!audioFile) {
            setError("Please select an audio file first.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();

            formData.append("file", audioFile);

            // Production backend
            const response = await fetch(
                `${API_URL}/voice/analyze`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        data.message ||
                        `Server returned ${response.status} ${response.statusText}`
                );
            }

            setResult(data);

        } catch (err) {
            console.error(
                "Voice analysis error:",
                err
            );

            setError(
                err.message ||
                    "Unable to analyze the audio. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    // ========================================================
    // RESET ANALYZER
    // ========================================================

    const handleReset = () => {
        setAudioFile(null);
        setAudioPreview("");
        setResult(null);
        setError("");

        const fileInput =
            document.getElementById(
                "voice-file-input"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };


    // ========================================================
    // FORMAT FILE SIZE
    // ========================================================

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return "0 KB";
        }

        const kb = bytes / 1024;

        if (kb < 1024) {
            return `${kb.toFixed(2)} KB`;
        }

        return `${(kb / 1024).toFixed(2)} MB`;
    };


    // ========================================================
    // RESULT STATUS CLASS
    // ========================================================

    const getStatusClass = (status) => {
        if (!status) {
            return "";
        }

        const value = String(status).toLowerCase();

        if (
            value.includes("fake") ||
            value.includes("deepfake") ||
            value.includes("malicious")
        ) {
            return "result-fake";
        }

        if (
            value.includes("warning") ||
            value.includes("suspicious")
        ) {
            return "result-warning";
        }

        return "result-real";
    };


    // ========================================================
    // CONFIDENCE
    // ========================================================

    const confidence = Math.min(
        Number(result?.confidence || 0),
        100
    );


    // ========================================================
    // PAGE
    // ========================================================

    return (
        <div className="voice-analyzer-page">

            <div className="voice-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="voice-header">

                    <div className="voice-icon">
                        🎙️
                    </div>

                    <div>

                        <div className="voice-badge">
                            CYBERGUARD VOICE SECURITY
                        </div>

                        <h1>
                            Voice Analyzer
                        </h1>

                        <p>
                            Detect AI-generated,
                            manipulated and suspicious
                            voice recordings using
                            intelligent analysis.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    UPLOAD CARD
                ================================================= */}

                <div className="voice-card">

                    <div className="voice-card-title">
                        <span>🎧</span>
                        Upload Voice Recording
                    </div>


                    {/* UPLOAD AREA */}

                    <div className="voice-upload-area">

                        <div className="voice-upload-icon">
                            🎤
                        </div>

                        <h3>
                            Select an audio file
                        </h3>

                        <p>
                            Supported formats:
                            MP3, WAV, OGG, WEBM, M4A
                        </p>

                        <label
                            htmlFor="voice-file-input"
                            className="voice-browse-btn"
                        >
                            Choose Audio
                        </label>

                        <input
                            id="voice-file-input"
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            hidden
                        />

                    </div>


                    {/* =================================================
                        AUDIO PREVIEW
                    ================================================= */}

                    {audioFile && (
                        <div className="voice-preview-section">

                            <div className="voice-preview-title">
                                Audio Preview
                            </div>

                            {audioPreview && (
                                <audio
                                    className="voice-audio-player"
                                    controls
                                    src={audioPreview}
                                >
                                    Your browser does not support
                                    audio playback.
                                </audio>
                            )}

                            <div className="voice-file-info">

                                <div>
                                    <strong>
                                        File:
                                    </strong>{" "}
                                    {audioFile.name}
                                </div>

                                <div>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {audioFile.type ||
                                        "Audio"}
                                </div>

                                <div>
                                    <strong>
                                        Size:
                                    </strong>{" "}
                                    {formatFileSize(
                                        audioFile.size
                                    )}
                                </div>

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        ANALYZE BUTTON
                    ================================================= */}

                    <button
                        className="voice-analyze-btn"
                        onClick={handleAnalyze}
                        disabled={
                            !audioFile || loading
                        }
                    >
                        {loading ? (
                            <>
                                <span className="voice-spinner"></span>
                                Analyzing Voice...
                            </>
                        ) : (
                            <>
                                🔍 Analyze Voice
                            </>
                        )}
                    </button>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div className="voice-error">
                            <span>⚠</span>
                            {error}
                        </div>
                    )}

                </div>


                {/* =================================================
                    RESULT
                ================================================= */}

                {result && (
                    <div className="voice-result-section">

                        <div className="voice-result-header">
                            <span>🛡️</span>
                            Voice Analysis Result
                        </div>


                        {/* STATUS */}

                        <div
                            className={`voice-status ${getStatusClass(
                                result.status
                            )}`}
                        >

                            <div className="voice-status-icon">

                                {getStatusClass(
                                    result.status
                                ) === "result-fake"
                                    ? "⚠️"
                                    : getStatusClass(
                                          result.status
                                      ) ===
                                      "result-warning"
                                    ? "⚠️"
                                    : "✓"}

                            </div>

                            <div>

                                <span className="voice-status-label">
                                    Detection Status
                                </span>

                                <strong>
                                    {result.status ||
                                        "Analysis Completed"}
                                </strong>

                            </div>

                        </div>


                        {/* RESULT GRID */}

                        <div className="voice-result-grid">

                            {/* DETECTION */}

                            <div className="voice-result-box">

                                <span className="voice-result-label">
                                    Detection
                                </span>

                                <strong>
                                    {result.detection ||
                                        result.result ||
                                        "No suspicious voice pattern detected"}
                                </strong>

                            </div>


                            {/* CONFIDENCE */}

                            <div className="voice-result-box">

                                <span className="voice-result-label">
                                    Confidence
                                </span>

                                <strong>
                                    {result.confidence ?? 0}%
                                </strong>

                                <div className="voice-confidence-bar">

                                    <div
                                        className="voice-confidence-fill"
                                        style={{
                                            width: `${confidence}%`,
                                        }}
                                    ></div>

                                </div>

                            </div>


                            {/* RISK */}

                            <div className="voice-result-box">

                                <span className="voice-result-label">
                                    Risk Level
                                </span>

                                <strong>
                                    {result.risk ||
                                        "Low"}
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            EVIDENCE
                        ================================================= */}

                        {result.evidence &&
                            result.evidence.length > 0 && (
                                <div className="voice-evidence">

                                    <h3>
                                        🔎 Evidence
                                    </h3>

                                    <ul>

                                        {result.evidence.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                >
                                                    <span>
                                                        ✓
                                                    </span>

                                                    {item}
                                                </li>
                                            )
                                        )}

                                    </ul>

                                </div>
                            )}


                        {/* =================================================
                            RECOMMENDATION
                        ================================================= */}

                        {result.recommended_action && (
                            <div className="voice-recommendation">

                                <h3>
                                    🛡️ Recommended Action
                                </h3>

                                <p>
                                    {
                                        result.recommended_action
                                    }
                                </p>

                            </div>
                        )}


                        {/* =================================================
                            RESET
                        ================================================= */}

                        <button
                            className="voice-reset-btn"
                            onClick={handleReset}
                        >
                            ↻ Analyze Another Voice
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};

export default VoiceAnalyzer;