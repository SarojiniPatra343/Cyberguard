
import { useRef, useState } from "react";
import "../styles/VideoAnalyzer.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function VideoAnalyzer() {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInput = useRef(null);

  function handleVideo(event) {
    const file = event.target.files?.[0];

    setError("");
    setResult(null);

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Video size must be less than 100 MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setVideo(file);
    setPreview(URL.createObjectURL(file));
  }

  async function analyzeVideo() {
    if (!video) {
      setError("Please upload a video first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", video);

      const response = await fetch(`${API_BASE}/video/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Video analysis failed."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the analysis server. Check your backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetAnalyzer() {
    if (preview) URL.revokeObjectURL(preview);

    setVideo(null);
    setPreview("");
    setResult(null);
    setError("");

    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }

  const risk = String(
    result?.risk_level || result?.risk || "Unknown"
  ).toUpperCase();

  const score = Number(
    result?.risk_score ?? result?.score ?? 0
  );

  const confidence = Number(result?.confidence ?? 0);

  return (
    <main className="video-page">
      <section className="video-hero">
        <div className="video-tag">
          <span className="status-dot" />
          CYBERGUARD INTELLIGENCE MODULE
        </div>

        <h1>
          VIDEO <span>ANALYZER</span>
        </h1>

        <p>
          Detect potential deepfake manipulation and suspicious video
          content with AI-assisted media analysis.
        </p>
      </section>

      <section className="video-layout">
        <div className="video-panel">
          <div className="panel-heading">
            <div>
              <h2>Media Inspection</h2>
              <p>Upload a video for security analysis</p>
            </div>
            <span className="panel-icon">▶</span>
          </div>

          <div
            className={`video-dropzone ${preview ? "has-video" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (event.dataTransfer.files?.[0]) {
                handleVideo({
                  target: { files: event.dataTransfer.files },
                });
              }
            }}
          >
            {preview ? (
              <video
                className="video-preview"
                src={preview}
                controls
                preload="metadata"
              />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">↑</div>
                <h3>Upload Video Evidence</h3>
                <p>Drag and drop a video here, or browse files</p>
                <span>MP4, WebM, MOV · Maximum 100 MB</span>
              </div>
            )}

            <input
              ref={fileInput}
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideo}
            />

            {!preview && (
              <button
                className="video-btn secondary"
                onClick={() => fileInput.current?.click()}
              >
                Browse Video
              </button>
            )}
          </div>

          {video && (
            <div className="video-file-info">
              <div className="file-symbol">VID</div>
              <div className="file-details">
                <strong>{video.name}</strong>
                <span>
                  {(video.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <button
                className="remove-video"
                onClick={resetAnalyzer}
                aria-label="Remove video"
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <div className="video-error" role="alert">
              {error}
            </div>
          )}

          <div className="video-actions">
            <button
              className="video-btn primary"
              onClick={analyzeVideo}
              disabled={!video || loading}
            >
              {loading ? (
                <>
                  <span className="video-spinner" />
                  Analyzing Video...
                </>
              ) : (
                "⚡ Analyze Video"
              )}
            </button>

            <button
              className="video-btn secondary"
              onClick={resetAnalyzer}
              disabled={loading}
            >
              Reset
            </button>
          </div>

          <p className="video-disclaimer">
            Analysis requires a connected backend model. Uploading a
            video alone does not determine whether it is genuine or fake.
          </p>
        </div>

        <aside className="video-info-panel">
          <div className="panel-heading">
            <div>
              <h2>Analysis Capabilities</h2>
              <p>Inspection modules</p>
            </div>
          </div>

          <div className="capability">
            <span className="capability-icon">◈</span>
            <div>
              <h3>Deepfake Detection</h3>
              <p>Identify potential facial manipulation artifacts.</p>
            </div>
          </div>

          <div className="capability">
            <span className="capability-icon">⌁</span>
            <div>
              <h3>Frame Inspection</h3>
              <p>Inspect sampled frames for visual inconsistencies.</p>
            </div>
          </div>

          <div className="capability">
            <span className="capability-icon">◎</span>
            <div>
              <h3>Media Integrity</h3>
              <p>Examine available metadata and file properties.</p>
            </div>
          </div>

          <div className="capability">
            <span className="capability-icon">⌘</span>
            <div>
              <h3>Risk Assessment</h3>
              <p>Present model findings and supporting evidence.</p>
            </div>
          </div>

          <div className="security-note">
            <span>◆ SYSTEM NOTE</span>
            <p>
              A model's prediction is an indicator, not definitive proof
              of manipulation. Results depend on model accuracy and video
              quality.
            </p>
          </div>
        </aside>
      </section>

      {result && (
        <section className="video-results">
          <div className="panel-heading">
            <div>
              <h2>Analysis Report</h2>
              <p>Results returned by the backend</p>
            </div>
            <span className="report-status">REPORT RECEIVED</span>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <span>Classification</span>
              <strong>{result.prediction || result.label || "Unknown"}</strong>
            </div>

            <div className="result-card">
              <span>Risk Level</span>
              <strong className={`risk-${risk.toLowerCase()}`}>
                {risk}
              </strong>
            </div>

            <div className="result-card">
              <span>Risk Score</span>
              <strong>{score}{result.risk_score != null || result.score != null ? "/100" : ""}</strong>
            </div>

            <div className="result-card">
              <span>Confidence</span>
              <strong>
                {result.confidence != null ? `${confidence}%` : "Not provided"}
              </strong>
            </div>
          </div>

          <div className="result-evidence">
            <h3>Evidence & Explanation</h3>
            <p>
              {result.explanation ||
                result.message ||
                result.details ||
                "No explanation was returned by the backend."}
            </p>

            {Array.isArray(result.evidence) && result.evidence.length > 0 && (
              <ul>
                {result.evidence.map((item, index) => (
                  <li key={index}>
                    {typeof item === "string"
                      ? item
                      : item.description || JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </main>
  );
}