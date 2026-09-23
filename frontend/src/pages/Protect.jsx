import { useState } from "react";

import {
    FaShieldAlt,
    FaLock,
    FaUserShield,
    FaKey,
    FaNetworkWired,
    FaCheckCircle,
    FaExclamationTriangle
} from "react-icons/fa";

import "../styles/protect.css";


function Protect() {

    const [protectionActive, setProtectionActive] = useState(true);
    const [message, setMessage] = useState("");


    const toggleProtection = () => {

        const newState = !protectionActive;

        setProtectionActive(newState);

        setMessage(
            newState
                ? "CYBERGUARD protection has been activated successfully."
                : "CYBERGUARD protection has been paused."
        );
    };


    const enableProtection = (name) => {

        if (!protectionActive) {
            setMessage(
                "Protection is currently paused. Activate protection first."
            );
            return;
        }

        setMessage(`${name} protection has been enabled successfully.`);
    };


    return (
        <div className="protect-page">

            <div className="protect-container">

                {/* HEADER */}

                <div className="protect-header">

                    <div className="protect-shield">
                        <FaShieldAlt />
                    </div>

                    <h1>
                        Digital Protection Center
                    </h1>

                    <p>
                        Strengthen your digital security with proactive
                        protection against cyber threats and unauthorized access.
                    </p>

                </div>


                {/* PROTECTION STATUS */}

                <div
                    className={`protection-status ${
                        protectionActive
                            ? "protection-on"
                            : "protection-off"
                    }`}
                >

                    <div className="protection-status-icon">
                        {protectionActive
                            ? <FaCheckCircle />
                            : <FaExclamationTriangle />
                        }
                    </div>


                    <div className="protection-status-content">

                        <span>
                            PROTECTION STATUS
                        </span>

                        <h2>
                            {protectionActive
                                ? "Your Digital Environment is Protected"
                                : "Protection is Paused"
                            }
                        </h2>

                        <p>
                            {protectionActive
                                ? "CYBERGUARD is actively monitoring security activities and protection controls."
                                : "Activate protection to resume cybersecurity monitoring and security controls."
                            }
                        </p>

                    </div>


                    <button
                        className={`protection-toggle ${
                            protectionActive
                                ? "toggle-on"
                                : "toggle-off"
                        }`}
                        onClick={toggleProtection}
                    >
                        {protectionActive
                            ? "PROTECTED"
                            : "PROTECTION OFF"
                        }
                    </button>

                </div>


                {/* SECURITY CONTROLS */}

                <div className="protection-section">

                    <div className="protection-section-heading">

                        <h2>
                            Security Controls
                        </h2>

                        <p>
                            Configure proactive security measures for your
                            digital environment.
                        </p>

                    </div>


                    <div className="protection-grid">


                        {/* ACCOUNT SECURITY */}

                        <div
                            className={`protection-card ${
                                !protectionActive
                                    ? "protection-disabled"
                                    : ""
                            }`}
                        >

                            <div className="protection-icon">
                                <FaUserShield />
                            </div>

                            <h3>
                                Account Security
                            </h3>

                            <p>
                                Monitor accounts for suspicious login
                                activity and unauthorized access attempts.
                            </p>

                            <button
                                onClick={() =>
                                    enableProtection("Account Security")
                                }
                            >
                                Enable Protection
                            </button>

                        </div>


                        {/* PASSWORD SECURITY */}

                        <div
                            className={`protection-card ${
                                !protectionActive
                                    ? "protection-disabled"
                                    : ""
                            }`}
                        >

                            <div className="protection-icon">
                                <FaKey />
                            </div>

                            <h3>
                                Credential Protection
                            </h3>

                            <p>
                                Protect passwords and authentication
                                credentials from compromise.
                            </p>

                            <button
                                onClick={() =>
                                    enableProtection("Credential Protection")
                                }
                            >
                                Enable Protection
                            </button>

                        </div>


                        {/* NETWORK SECURITY */}

                        <div
                            className={`protection-card ${
                                !protectionActive
                                    ? "protection-disabled"
                                    : ""
                            }`}
                        >

                            <div className="protection-icon">
                                <FaNetworkWired />
                            </div>

                            <h3>
                                Network Security
                            </h3>

                            <p>
                                Monitor suspicious network behaviour,
                                connections and potential attacks.
                            </p>

                            <button
                                onClick={() =>
                                    enableProtection("Network Security")
                                }
                            >
                                Enable Protection
                            </button>

                        </div>


                        {/* ACCESS CONTROL */}

                        <div
                            className={`protection-card ${
                                !protectionActive
                                    ? "protection-disabled"
                                    : ""
                            }`}
                        >

                            <div className="protection-icon">
                                <FaLock />
                            </div>

                            <h3>
                                Access Control
                            </h3>

                            <p>
                                Strengthen access controls and prevent
                                unauthorized users from reaching protected resources.
                            </p>

                            <button
                                onClick={() =>
                                    enableProtection("Access Control")
                                }
                            >
                                Enable Protection
                            </button>

                        </div>

                    </div>

                </div>


                {/* SECURITY OVERVIEW */}

                <div className="security-overview">

                    <div className="overview-header">

                        <FaShieldAlt />

                        <h2>
                            Protection Overview
                        </h2>

                    </div>


                    <div className="overview-grid">

                        <div className="overview-box">

                            <span>
                                Threat Monitoring
                            </span>

                            <strong className={
                                protectionActive
                                    ? "enabled"
                                    : "disabled"
                            }>
                                {protectionActive
                                    ? "ACTIVE"
                                    : "PAUSED"
                                }
                            </strong>

                        </div>


                        <div className="overview-box">

                            <span>
                                Account Security
                            </span>

                            <strong className="enabled">
                                ENABLED
                            </strong>

                        </div>


                        <div className="overview-box">

                            <span>
                                Network Monitoring
                            </span>

                            <strong className="enabled">
                                ACTIVE
                            </strong>

                        </div>


                        <div className="overview-box">

                            <span>
                                Security Level
                            </span>

                            <strong className="high">
                                HIGH
                            </strong>

                        </div>

                    </div>

                </div>


                {/* MESSAGE */}

                {message && (

                    <div className="protection-message">

                        <FaCheckCircle />

                        <div>

                            <h3>
                                Security Update
                            </h3>

                            <p>
                                {message}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}


export default Protect;