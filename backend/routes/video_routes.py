import os
import tempfile
from pathlib import Path
from typing import Any

import cv2
from fastapi import APIRouter, File, HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

router = APIRouter(prefix="/video", tags=["Video Analyzer"])

MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100 MB
CHUNK_SIZE = 1024 * 1024
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".mpeg", ".mpg"}
SAMPLED_FRAME_LIMIT = 12


def inspect_video(video_path: str) -> dict[str, Any]:
    """Inspect basic video properties and sample frames; no deepfake inference."""
    capture = cv2.VideoCapture(video_path)

    if not capture.isOpened():
        capture.release()
        raise ValueError(
            "The uploaded file could not be opened as a supported video. "
            "Try an MP4 or WebM file."
        )

    try:
        fps = float(capture.get(cv2.CAP_PROP_FPS) or 0)
        reported_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
        height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)

        if width <= 0 or height <= 0:
            raise ValueError("The video does not contain readable frame dimensions.")

        duration = (
            round(reported_frames / fps, 2)
            if fps > 0 and reported_frames > 0
            else None
        )

        # Sample frames across the clip rather than decoding every frame.
        if reported_frames > 0:
            sample_count = min(SAMPLED_FRAME_LIMIT, reported_frames)
            positions = sorted(
                {
                    int(i * max(reported_frames - 1, 0) / max(sample_count - 1, 1))
                    for i in range(sample_count)
                }
            )
        else:
            positions = list(range(SAMPLED_FRAME_LIMIT))

        frame_brightness = []
        frame_sharpness = []
        decoded_frames = 0

        for position in positions:
            if reported_frames > 0:
                capture.set(cv2.CAP_PROP_POS_FRAMES, position)

            ok, frame = capture.read()
            if not ok or frame is None:
                continue

            decoded_frames += 1
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            frame_brightness.append(round(float(gray.mean()), 2))
            frame_sharpness.append(
                round(float(cv2.Laplacian(gray, cv2.CV_64F).var()), 2)
            )

        if decoded_frames == 0:
            raise ValueError("No readable video frames were found.")

        return {
            "width": width,
            "height": height,
            "fps": round(fps, 2) if fps > 0 else None,
            "reported_frame_count": reported_frames or None,
            "duration_seconds": duration,
            "sampled_frames": decoded_frames,
            "average_frame_brightness": round(
                sum(frame_brightness) / len(frame_brightness), 2
            ),
            "average_frame_sharpness": round(
                sum(frame_sharpness) / len(frame_sharpness), 2
            ),
        }
    finally:
        capture.release()


@router.post("/analyze")
async def analyze_video(file: UploadFile = File(...)):
    """
    Receive a video and return preliminary technical inspection results.

    The response format is compatible with the React VideoAnalyzer page.
    A trained deepfake model is not included in this endpoint.
    """
    filename = file.filename or "uploaded_video"
    extension = Path(filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=(
                "Unsupported video extension. Allowed formats: "
                + ", ".join(sorted(ALLOWED_EXTENSIONS))
            ),
        )

    temp_path = None
    total_bytes = 0

    try:
        # Stream to a temporary file and enforce the limit while reading.
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            temp_path = temp_file.name

            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break

                total_bytes += len(chunk)
                if total_bytes > MAX_VIDEO_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="Video is too large. Maximum allowed size is 100 MB.",
                    )

                temp_file.write(chunk)

        if total_bytes == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        try:
            metadata = await run_in_threadpool(inspect_video, temp_path)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        # Do not fabricate a risk score or claim real/fake without a model.
        return {
            "filename": Path(filename).name,
            "file_size_bytes": total_bytes,
            "prediction": "Not evaluated — detection model not connected",
            "label": "Technical inspection only",
            "risk_level": "Unknown",
            "risk_score": None,
            "confidence": None,
            "explanation": (
                "The video was opened and sampled successfully. The returned "
                "measurements describe basic video properties only; they do not "
                "establish whether the video is genuine or manipulated. Connect "
                "a trained, validated deepfake-detection model to produce an "
                "authenticity prediction."
            ),
            "evidence": [
                f"Video dimensions: {metadata['width']} × {metadata['height']}",
                f"Sampled and decoded {metadata['sampled_frames']} frame(s)",
                (
                    "Frame brightness and sharpness statistics were calculated; "
                    "these are not deepfake indicators on their own."
                ),
            ],
            "metadata": metadata,
            "model_connected": False,
        }

    except HTTPException:
        raise
    except Exception as exc:
        # Avoid returning local paths or internal exception details to clients.
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while inspecting the video.",
        ) from exc
    finally:
        await file.close()
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
