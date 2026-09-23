import { useEffect, useState } from "react";
import {
    FaHistory,
    FaSearch,
    FaShieldAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaDatabase,
    FaSyncAlt
} from "react-icons/fa";

import { getThreatHistory } from "../services/api";
import "../styles/ThreatHistory.css";


function ThreatHistory() {

    const [threats, setThreats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");


    const loadHistory = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getThreatHistory();

            setThreats(data.threats || []);

        } catch (err) {

            setError(
                err.message ||
                "Unable to load threat history"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadHistory();

    }, []);


    /* =====================================================
       FILTER
    ===================================================== */

    const filteredThreats = threats.filter((threat) => {

        const selectedFilter =
            filter === "ALL" ||
            threat.type?.toUpperCase() === filter ||
            threat.risk?.toUpperCase() === filter;

        const searchText = search.toLowerCase();

        const matchesSearch =
            !searchText ||
            threat.input?.toLowerCase().includes(searchText) ||
            threat.threat_type?.toLowerCase().includes(searchText);

        return selectedFilter && matchesSearch;

    });


    /* =====================================================
       DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) return "Unknown";

        return new Date(date).toLocaleString();

    };


    /* =====================================================
       RISK CLASS
    ===================================================== */

    const getRiskClass = (risk) => {

        if (!risk) return "safe";

        return risk.toLowerCase();

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="history-page">

                <div className="history-container">

                    <div className="history-loading">

                        <FaSyncAlt className="history-loading-icon" />

                        <h2>
                            Loading Threat History...
                        </h2>

                        <p>
                            Fetching security records from MongoDB
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <div className="history-page">

                <div className="history-container">

                    <div className="history-error">

                        <FaExclamationTriangle />

                        <h2>
                            Unable to Load History
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={loadHistory}
                            className="history-retry"
                        >

                            <FaSyncAlt />

                            Retry

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="history-page">

            <div className="history-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="history-header">

                    <div className="history-header-icon">

                        <FaHistory />

                    </div>

                    <div>

                        <h1>
                            Threat History
                        </h1>

                        <p>
                            Review previously detected
                            cybersecurity threats and analysis results.
                        </p>

                    </div>


                    <button
                        className="history-refresh"
                        onClick={loadHistory}
                    >

                        <FaSyncAlt />

                        Refresh

                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="history-summary">

                    <div className="history-summary-card">

                        <FaDatabase />

                        <div>

                            <span>
                                Total Records
                            </span>

                            <strong>
                                {threats.length}
                            </strong>

                        </div>

                    </div>


                    <div className="history-summary-card threat-summary">

                        <FaExclamationTriangle />

                        <div>

                            <span>
                                Threats
                            </span>

                            <strong>
                                {
                                    threats.filter(
                                        (item) =>
                                            item.is_threat === true
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="history-summary-card safe-summary">

                        <FaCheckCircle />

                        <div>

                            <span>
                                Safe
                            </span>

                            <strong>
                                {
                                    threats.filter(
                                        (item) =>
                                            item.is_threat === false
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div className="history-controls">


                    {/* SEARCH */}

                    <div className="history-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search URL, email or threat..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* FILTER */}

                    <div className="history-filters">

                        {[
                            "ALL",
                            "URL",
                            "EMAIL",
                            "MESSAGE",
                            "CRITICAL",
                            "HIGH",
                            "MEDIUM",
                            "LOW",
                            "SAFE"
                        ].map((item) => (

                            <button
                                key={item}
                                className={
                                    filter === item
                                        ? "filter-btn active"
                                        : "filter-btn"
                                }
                                onClick={() =>
                                    setFilter(item)
                                }
                            >

                                {item}

                            </button>

                        ))}

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="history-card">

                    <div className="history-table">


                        {/* HEADER */}

                        <div className="history-table-header">

                            <span>
                                Type
                            </span>

                            <span>
                                Threat
                            </span>

                            <span>
                                Risk
                            </span>

                            <span>
                                Score
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Date
                            </span>

                        </div>


                        {/* ROWS */}

                        {filteredThreats.length > 0 ? (

                            filteredThreats.map((threat) => (

                                <div
                                    className="history-table-row"
                                    key={threat._id}
                                >

                                    <span className="history-type">

                                        {threat.type}

                                    </span>


                                    <span className="history-threat">

                                        <FaShieldAlt />

                                        {threat.threat_type}

                                    </span>


                                    <span
                                        className={
                                            `history-risk ${getRiskClass(
                                                threat.risk
                                            )}`
                                        }
                                    >

                                        {threat.risk}

                                    </span>


                                    <span className="history-score">

                                        {threat.risk_score}

                                    </span>


                                    <span
                                        className={
                                            threat.is_threat
                                                ? "history-status threat"
                                                : "history-status safe"
                                        }
                                    >

                                        {threat.is_threat ? (
                                            <>
                                                <FaExclamationTriangle />
                                                THREAT
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                SAFE
                                            </>
                                        )}

                                    </span>


                                    <span className="history-date">

                                        {formatDate(
                                            threat.created_at
                                        )}

                                    </span>

                                </div>

                            ))

                        ) : (

                            <div className="history-empty">

                                <FaCheckCircle />

                                <h3>
                                    No Records Found
                                </h3>

                                <p>
                                    No threat records match
                                    your current search or filter.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    DATABASE STATUS
                ================================================= */}

                <div className="history-database">

                    <FaDatabase />

                    <span>
                        Connected to CYBERGUARD MongoDB
                    </span>

                    <strong>
                        ● ONLINE
                    </strong>

                </div>


            </div>

        </div>

    );

}


export default ThreatHistory;