import { useState } from "react";
import { executeResponse } from "../services/api";
import {
    FaExclamationTriangle,
    FaBan,
    FaLink,
    FaUserLock,
    FaBell,
    FaCheckCircle,
} from "react-icons/fa";

import "../styles/respond.css";

function Respond() {

    const [active, setActive] = useState(false);
    const [selectedAction, setSelectedAction] = useState("");
    const [message, setMessage] = useState("");

    const handleActivate = () => {
        setActive(!active);

        if (!active) {
            setMessage("Security Response Center is now ACTIVE.");
        } else {
            setMessage("Security Response Center has been deactivated.");
            setSelectedAction("");
        }
    };

   const handleAction = async (action) => {

    if (!active) {
        setMessage(
            "Please activate the Security Response Center first."
        );
        return;
    }

    try {

        setSelectedAction(action);

        setMessage(`Executing ${action}...`);

        const data = await executeResponse(
            action,
            "Detected Cyber Threat",
            "User System"
        );

        setMessage(data.message);

    } catch (error) {

        setMessage(
            error.message || "Unable to execute response action."
        );

    }
};

    return (
        <div className="respond-page">

            <div className="respond-container">

                {/* HEADER */}

                <div className="respond-header">

                    <div className="respond-icon">
                        <FaExclamationTriangle />
                    </div>

                    <span>CYBERGUARD RESPONSE ENGINE</span>

                    <h1>Threat Response Center</h1>

                    <p>
                        Take immediate security actions against detected
                        cyber threats and suspicious activities.
                    </p>

                </div>


                {/* RESPONSE STATUS */}

                <div className="response-status-card">

                    <div className="response-warning-icon">
                        <FaExclamationTriangle />
                    </div>

                    <div className="response-status-content">

                        <span>
                            THREAT RESPONSE STATUS
                        </span>

                        <h2>
                            Security Response Center
                        </h2>

                        <p>
                            Select an appropriate response action to contain
                            and mitigate a detected threat.
                        </p>

                    </div>


                    <button
                        className={`active-button ${active ? "is-active" : ""}`}
                        onClick={handleActivate}
                    >
                        {active ? "ACTIVE" : "INACTIVE"}
                    </button>

                </div>


                {/* MESSAGE */}

                {message && (
                    <div className={`response-message ${active ? "success" : "warning"}`}>

                        {active ? (
                            <FaCheckCircle />
                        ) : (
                            <FaExclamationTriangle />
                        )}

                        <span>{message}</span>

                    </div>
                )}


                {/* RESPONSE ACTIONS */}

                <div className="response-actions">

                    <div className="response-section-title">

                        <h2>
                            Response Actions
                        </h2>

                        <p>
                            Choose an action to respond to the detected threat.
                        </p>

                    </div>


                    <div className="response-grid">


                        {/* BLOCK URL */}

                        <div
                            className={`response-card ${selectedAction === "Block Malicious URL" ? "selected" : ""}`}
                            onClick={() => handleAction("Block Malicious URL")}
                        >

                            <div className="response-card-icon">
                                <FaBan />
                            </div>

                            <h3>
                                Block Malicious URL
                            </h3>

                            <p>
                                Block access to a suspicious or malicious
                                website immediately.
                            </p>

                            <button>
                                Block URL →
                            </button>

                        </div>


                        {/* QUARANTINE */}

                        <div
                            className={`response-card ${selectedAction === "Quarantine Threat" ? "selected" : ""}`}
                            onClick={() => handleAction("Quarantine Threat")}
                        >

                            <div className="response-card-icon">
                                <FaExclamationTriangle />
                            </div>

                            <h3>
                                Quarantine Threat
                            </h3>

                            <p>
                                Isolate a detected threat to prevent it
                                from affecting other systems.
                            </p>

                            <button>
                                Quarantine →
                            </button>

                        </div>


                        {/* REVOKE SESSION */}

                        <div
                            className={`response-card ${selectedAction === "Revoke User Session" ? "selected" : ""}`}
                            onClick={() => handleAction("Revoke User Session")}
                        >

                            <div className="response-card-icon">
                                <FaUserLock />
                            </div>

                            <h3>
                                Revoke User Session
                            </h3>

                            <p>
                                Terminate suspicious sessions to help
                                prevent account takeover.
                            </p>

                            <button>
                                Revoke Session →
                            </button>

                        </div>


                        {/* BLOCK LINK */}

                        <div
                            className={`response-card ${selectedAction === "Block Suspicious Link" ? "selected" : ""}`}
                            onClick={() => handleAction("Block Suspicious Link")}
                        >

                            <div className="response-card-icon">
                                <FaLink />
                            </div>

                            <h3>
                                Block Suspicious Link
                            </h3>

                            <p>
                                Prevent users from accessing potentially
                                dangerous links.
                            </p>

                            <button>
                                Block Link →
                            </button>

                        </div>


                        {/* ALERT ADMIN */}

                        <div
                            className={`response-card ${selectedAction === "Alert Security Administrator" ? "selected" : ""}`}
                            onClick={() => handleAction("Alert Security Administrator")}
                        >

                            <div className="response-card-icon">
                                <FaBell />
                            </div>

                            <h3>
                                Alert Administrator
                            </h3>

                            <p>
                                Notify the security administrator about
                                a detected cyber incident.
                            </p>

                            <button>
                                Send Alert →
                            </button>

                        </div>


                        {/* SECURITY CHECK */}

                        <div
                            className={`response-card ${selectedAction === "Start Security Check" ? "selected" : ""}`}
                            onClick={() => handleAction("Start Security Check")}
                        >

                            <div className="response-card-icon">
                                <FaCheckCircle />
                            </div>

                            <h3>
                                Security Check
                            </h3>

                            <p>
                                Start an additional security verification
                                for the affected system or account.
                            </p>

                            <button>
                                Start Check →
                            </button>

                        </div>

                    </div>

                </div>


                {/* CURRENT ACTION */}

                {selectedAction && active && (

                    <div className="current-response">

                        <FaCheckCircle />

                        <div>

                            <span>
                                CURRENT RESPONSE ACTION
                            </span>

                            <h3>
                                {selectedAction}
                            </h3>

                            <p>
                                The response action has been initiated
                                by the CYBERGUARD response engine.
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Respond;