import React, { useState } from "react";
import "../styles/image-analyzer.css";

const ImageAnalyzer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    /* =========================================
       FILE SELECTION
    ========================================= */

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        setError("");
        setResult(null);

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        setSelectedFile(file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };


    /* =========================================
       IMAGE ANALYSIS
    ========================================= */

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();

            formData.append("file", selectedFile);

            const response = await fetch("https://cyberguard-backend-dewc.onrender.com/api/image/analyze",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Image analysis failed."
                );
            }

            setResult(data);

        } catch (err) {
            setError(
                err.message ||
                "Unable to analyze the image."
            );
        } finally {
            setLoading(false);
        }
    };


    /* =========================================
       RESET
    ========================================= */

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setError("");
    };


    /* =========================================
       FORMAT FILE SIZE
    ========================================= */

    const formatFileSize = (bytes) => {
        if (!bytes) return "0 KB";

        const kb = bytes / 1024;

        if (kb < 1024) {
            return `${kb.toFixed(1)} KB`;
        }

        return `${(kb / 1024).toFixed(2)} MB`;
    };


    /* =========================================
       RESULT STATUS
    ========================================= */

    const getStatusClass = () => {
        if (!result) return "";

        const status =
            result.status ||
            result.result ||
            result.prediction ||
            "";

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


    return (
        <div className="media-analyzer-page">

            <div className="media-container">

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="media-header">

                    <div className="media-badge">
                        IMAGE ANALYZER
                    </div>

                    <h1>
                        Image Analyzer
                    </h1>

                    <p>
                        Upload an image to detect suspicious,
                        manipulated or potentially AI-generated content.
                    </p>

                </div>


                {/* =========================================
                    UPLOAD CARD
                ========================================= */}

                <div className="media-card">

                    <div className="upload-area">

                        <div className="upload-icon">
                            🖼️
                        </div>

                        <h2>
                            Upload Image
                        </h2>

                        <p>
                            Select an image file for intelligent
                            cybersecurity analysis.
                        </p>


                        <label
                            htmlFor="image-upload"
                            className="browse-btn"
                        >
                            Choose Image
                        </label>

                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden
                        />

                    </div>


                    {/* =========================================
                        IMAGE PREVIEW
                    ========================================= */}

                    {preview && (
                        <div className="image-preview">

                            <h3>
                                Image Preview
                            </h3>

                            <img
                                src={preview}
                                alt="Selected preview"
                            />

                        </div>
                    )}


                    {/* =========================================
                        FILE INFORMATION
                    ========================================= */}

                    {selectedFile && (
                        <div className="file-info">

                            <div>
                                <span>
                                    File Name
                                </span>

                                <strong>
                                    {selectedFile.name}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    File Type
                                </span>

                                <strong>
                                    {selectedFile.type}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    File Size
                                </span>

                                <strong>
                                    {formatFileSize(
                                        selectedFile.size
                                    )}
                                </strong>
                            </div>

                        </div>
                    )}


                    {/* =========================================
                        ACTION BUTTONS
                    ========================================= */}

                    {selectedFile && (
                        <div className="media-actions">

                            <button
                                className="analyze-media-btn"
                                onClick={handleAnalyze}
                                disabled={loading}
                            >
                                {loading
                                    ? "Analyzing..."
                                    : "Analyze Image"}
                            </button>


                            <button
                                className="reset-media-btn"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset
                            </button>

                        </div>
                    )}


                    {/* =========================================
                        LOADING
                    ========================================= */}

                    {loading && (
                        <div className="media-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                AI is analyzing the image...
                            </p>

                        </div>
                    )}


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {error && (
                        <div className="media-error">
                            ⚠️ {error}
                        </div>
                    )}


                    {/* =========================================
                        RESULT
                    ========================================= */}

                    {result && !loading && (
                        <div className="media-result">

                            <div className="result-header">

                                <div>
                                    <span className="result-label">
                                        ANALYSIS COMPLETE
                                    </span>

                                    <h2>
                                        Image Analysis Result
                                    </h2>
                                </div>

                                <div
                                    className={`result-status ${getStatusClass()}`}
                                >
                                    {result.status ||
                                        result.result ||
                                        result.prediction ||
                                        "Analyzed"}
                                </div>

                            </div>


                            {/* =================================
                                RESULT GRID
                            ================================= */}

                            <div className="result-grid">

                                <div className="result-item">

                                    <span>
                                        Detection
                                    </span>

                                    <strong>
                                        {result.detection ||
                                            result.status ||
                                            result.result ||
                                            "Analyzed"}
                                    </strong>

                                </div>


                                <div className="result-item">

                                    <span>
                                        Confidence
                                    </span>

                                    <strong>
                                        {result.confidence !== undefined
                                            ? `${result.confidence}%`
                                            : "N/A"}
                                    </strong>

                                </div>


                                <div className="result-item">

                                    <span>
                                        Risk Level
                                    </span>

                                    <strong>
                                        {result.risk ||
                                            result.risk_level ||
                                            "N/A"}
                                    </strong>

                                </div>

                            </div>


                            {/* =================================
                                CONFIDENCE
                            ================================= */}

                            {result.confidence !== undefined && (
                                <div className="confidence-section">

                                    <div className="confidence-header">

                                        <span>
                                            Confidence Score
                                        </span>

                                        <strong>
                                            {result.confidence}%
                                        </strong>

                                    </div>

                                    <div className="confidence-bar">

                                        <div
                                            className="confidence-fill"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Number(
                                                            result.confidence
                                                        )
                                                    )
                                                )}%`,
                                            }}
                                        ></div>

                                    </div>

                                </div>
                            )}


                            {/* =================================
                                EVIDENCE
                            ================================= */}

                            {result.evidence && (
                                <div className="media-evidence">

                                    <h3>
                                        Evidence
                                    </h3>

                                    {Array.isArray(result.evidence) ? (
                                        <ul>
                                            {result.evidence.map(
                                                (item, index) => (
                                                    <li key={index}>
                                                        ✓ {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p>
                                            {result.evidence}
                                        </p>
                                    )}

                                </div>
                            )}


                            {/* =================================
                                RECOMMENDATION
                            ================================= */}

                            {(
                                result.recommended_action ||
                                result.recommendation
                            ) && (
                                <div className="media-recommendation">

                                    <h3>
                                        Recommended Action
                                    </h3>

                                    <p>
                                        {result.recommended_action ||
                                            result.recommendation}
                                    </p>

                                </div>
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ImageAnalyzer;