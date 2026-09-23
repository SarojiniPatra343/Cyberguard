import React, { useState } from "react";
import "../styles/image-analyzer.css";

const API_URL =
    "https://cyberguard-backend-dewc.onrender.com/api";

const ImageAnalyzer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================================================
    // SELECT IMAGE
    // =========================================================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        setError("");
        setResult(null);

        if (!file) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        setSelectedFile(file);

        const imageURL = URL.createObjectURL(file);
        setPreview(imageURL);
    };

    // =========================================================
    // ANALYZE IMAGE
    // =========================================================

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

            const response = await fetch(
                `${API_URL}/image/detect`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            let data;

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        data.message ||
                        "Image analysis failed."
                );
            }

            setResult(data);
        } catch (err) {
            console.error("Image Analyzer Error:", err);

            setError(
                err.message ||
                    "Failed to connect to the CyberGuard backend."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setError("");

        const fileInput =
            document.getElementById("image-upload");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // =========================================================
    // RESULT VALUE HELPER
    // =========================================================

    const getResultValue = (keys, fallback = "N/A") => {
        if (!result) {
            return fallback;
        }

        for (const key of keys) {
            if (
                result[key] !== undefined &&
                result[key] !== null
            ) {
                return result[key];
            }
        }

        return fallback;
    };

    const detection = getResultValue(
        ["result", "prediction", "classification", "label"],
        "N/A"
    );

    const confidence = getResultValue(
        ["confidence", "confidence_score"],
        "N/A"
    );

    const message = getResultValue(
        ["message", "analysis", "description"],
        ""
    );

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="image-analyzer-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="image-analyzer-header">
                <div className="image-analyzer-badge">
                    AI MEDIA SECURITY
                </div>

                <h1>IMAGE AUTHENTICITY ANALYZER</h1>

                <p>
                    Upload an image and let CYBERGUARD analyze
                    it for signs of manipulation, synthetic
                    generation, or suspicious content.
                </p>
            </div>

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <div className="image-analyzer-card">

                {/* =================================================
                    UPLOAD AREA
                ================================================= */}

                <div className="image-upload-section">

                    <label
                        htmlFor="image-upload"
                        className="image-upload-box"
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Selected preview"
                                className="image-preview"
                            />
                        ) : (
                            <>
                                <div className="upload-icon">
                                    +
                                </div>

                                <h3>
                                    Upload Image
                                </h3>

                                <p>
                                    Click to select an image
                                </p>

                                <span>
                                    PNG, JPG, JPEG, WEBP
                                </span>
                            </>
                        )}

                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden
                        />
                    </label>
                </div>

                {/* =================================================
                    FILE INFORMATION
                ================================================= */}

                {selectedFile && (
                    <div className="image-file-information">

                        <div className="image-info-box">
                            <span>FILE NAME</span>

                            <strong>
                                {selectedFile.name}
                            </strong>
                        </div>

                        <div className="image-info-box">
                            <span>FILE TYPE</span>

                            <strong>
                                {selectedFile.type ||
                                    "Unknown"}
                            </strong>
                        </div>

                        <div className="image-info-box">
                            <span>FILE SIZE</span>

                            <strong>
                                {(
                                    selectedFile.size /
                                    1024
                                ).toFixed(1)}{" "}
                                KB
                            </strong>
                        </div>

                    </div>
                )}

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="image-action-buttons">

                    <button
                        className="analyze-image-button"
                        onClick={handleAnalyze}
                        disabled={
                            !selectedFile || loading
                        }
                    >
                        {loading
                            ? "Analyzing..."
                            : "Analyze Image"}
                    </button>

                    <button
                        className="reset-image-button"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="image-error-message">
                        ⚠️ {error}
                    </div>
                )}

                {/* =================================================
                    RESULT
                ================================================= */}

                {result && (
                    <div className="image-result-card">

                        <div className="result-header">
                            <span>
                                AI ANALYSIS RESULT
                            </span>
                        </div>

                        <div className="result-content">

                            <div className="result-item">
                                <span>
                                    CLASSIFICATION
                                </span>

                                <strong>
                                    {String(
                                        detection
                                    )}
                                </strong>
                            </div>

                            <div className="result-item">
                                <span>
                                    CONFIDENCE
                                </span>

                                <strong>
                                    {typeof confidence ===
                                    "number"
                                        ? `${confidence}%`
                                        : String(
                                              confidence
                                          )}
                                </strong>
                            </div>

                            {message && (
                                <div className="result-description">
                                    <span>
                                        ANALYSIS
                                    </span>

                                    <p>
                                        {String(
                                            message
                                        )}
                                    </p>
                                </div>
                            )}

                        </div>

                        <details className="raw-result">
                            <summary>
                                View API Response
                            </summary>

                            <pre>
                                {JSON.stringify(
                                    result,
                                    null,
                                    2
                                )}
                            </pre>
                        </details>

                    </div>
                )}

            </div>

            {/* =================================================
                SECURITY INFORMATION
            ================================================= */}

            <div className="image-security-info">

                <div>
                    <span>✓</span>
                    AI-Based Detection
                </div>

                <div>
                    <span>✓</span>
                    Secure API Processing
                </div>

                <div>
                    <span>✓</span>
                    Cyber Threat Analysis
                </div>

            </div>

        </div>
    );
};

export default ImageAnalyzer;