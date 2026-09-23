import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaShieldAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaLink,
    FaEnvelope,
    FaComments,
    FaChartLine,
    FaDatabase,
    FaSyncAlt,
    FaHistory
} from "react-icons/fa";

import { getDashboardStats } from "../services/api";

import "../styles/dashboard.css";


function Dashboard() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
const navigate = useNavigate();

    /* =====================================================
       LOAD DASHBOARD DATA
    ===================================================== */

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const result = await getDashboardStats();

            setData(result);

        } catch (err) {

            setError(
                err.message ||
                "Unable to load dashboard data"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-container">

                    <div className="dashboard-loading">

                        <FaSyncAlt className="loading-icon" />

                        <h2>
                            Loading CYBERGUARD Dashboard...
                        </h2>

                        <p>
                            Fetching security data from MongoDB
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

            <div className="dashboard-page">

                <div className="dashboard-container">

                    <div className="dashboard-error">

                        <FaExclamationTriangle />

                        <h2>
                            Dashboard Error
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            className="dashboard-retry"
                            onClick={loadDashboard}
                        >

                            <FaSyncAlt />

                            Retry

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       DATA
    ===================================================== */

    const stats = data?.stats || {};

    const recentActivity =
        data?.recent_activity || [];


    /* =====================================================
       RISK CLASS
    ===================================================== */

    const getRiskClass = (risk) => {

        if (!risk) {
            return "risk-safe";
        }

        return `risk-${risk.toLowerCase()}`;

    };


    return (

        <div className="dashboard-page">

            <div className="dashboard-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="dashboard-header">

                    <div className="dashboard-header-icon">

                        <FaShieldAlt />

                    </div>


                    <div>

                        <h1>
                            CYBERGUARD Security Dashboard
                        </h1>

                        <p>
                            AI-powered cyber threat monitoring
                            and security analysis
                        </p>

                    </div>
                    <button
                        className="history-dashboard-btn"
                        onClick={() => navigate("/threat-history")}
                    >
                        <FaHistory />
                        Threat History
                    </button>

                    <button
                        className="refresh-btn"
                        onClick={loadDashboard}
                    >

                        <FaSyncAlt />

                        <span>
                            Refresh
                        </span>

                    </button>

                </div>


                {/* =================================================
                    SECURITY SCORE
                ================================================= */}

                <div className="security-score-card">

                    <div className="score-icon">

                        <FaShieldAlt />

                    </div>


                    <div className="score-content">

                        <span>
                            Overall Security Score
                        </span>

                        <strong>
                            {stats.security_score ?? 0}%
                        </strong>

                        <p>
                            Based on analyzed security events
                        </p>

                    </div>


                    <div className="score-progress">

                        <div
                            className="score-progress-fill"
                            style={{
                                width: `${stats.security_score ?? 0}%`
                            }}
                        />

                    </div>

                </div>


                {/* =================================================
                    MAIN STATISTICS
                ================================================= */}

                <div className="stats-grid">


                    {/* TOTAL */}

                    <div className="stat-card">

                        <div className="stat-icon blue">

                            <FaDatabase />

                        </div>

                        <div>

                            <span>
                                Total Analyses
                            </span>

                            <strong>
                                {stats.total ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* THREATS */}

                    <div className="stat-card">

                        <div className="stat-icon red">

                            <FaExclamationTriangle />

                        </div>

                        <div>

                            <span>
                                Threats Detected
                            </span>

                            <strong>
                                {stats.detected ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* SAFE */}

                    <div className="stat-card">

                        <div className="stat-icon green">

                            <FaCheckCircle />

                        </div>

                        <div>

                            <span>
                                Safe Results
                            </span>

                            <strong>
                                {stats.safe ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* SECURITY SCORE */}

                    <div className="stat-card">

                        <div className="stat-icon cyan">

                            <FaChartLine />

                        </div>

                        <div>

                            <span>
                                Security Score
                            </span>

                            <strong>
                                {stats.security_score ?? 0}%
                            </strong>

                        </div>

                    </div>


                </div>


                {/* =================================================
                    ANALYSIS OVERVIEW
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-heading">

                        <FaChartLine />

                        <h2>
                            Analysis Overview
                        </h2>

                    </div>


                    <div className="analysis-grid">


                        {/* URL */}

                        <div className="analysis-card">

                            <FaLink />

                            <span>
                                URL Analysis
                            </span>

                            <strong>
                                {stats.url ?? 0}
                            </strong>

                        </div>


                        {/* EMAIL */}

                        <div className="analysis-card">

                            <FaEnvelope />

                            <span>
                                Email Analysis
                            </span>

                            <strong>
                                {stats.email ?? 0}
                            </strong>

                        </div>


                        {/* MESSAGE */}

                        <div className="analysis-card">

                            <FaComments />

                            <span>
                                Message Analysis
                            </span>

                            <strong>
                                {stats.message ?? 0}
                            </strong>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    THREAT RISK LEVELS
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-heading">

                        <FaExclamationTriangle />

                        <h2>
                            Threat Risk Levels
                        </h2>

                    </div>


                    <div className="risk-grid">


                        {/* CRITICAL */}

                        <div className="risk-card critical">

                            <span>
                                Critical
                            </span>

                            <strong>
                                {stats.critical ?? 0}
                            </strong>

                        </div>


                        {/* HIGH */}

                        <div className="risk-card high">

                            <span>
                                High
                            </span>

                            <strong>
                                {stats.high ?? 0}
                            </strong>

                        </div>


                        {/* MEDIUM */}

                        <div className="risk-card medium">

                            <span>
                                Medium
                            </span>

                            <strong>
                                {stats.medium ?? 0}
                            </strong>

                        </div>


                        {/* LOW */}

                        <div className="risk-card low">

                            <span>
                                Low
                            </span>

                            <strong>
                                {stats.low ?? 0}
                            </strong>

                        </div>


                    </div>

                </div>


                {/* =================================================
                    RECENT THREAT ACTIVITY
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-heading">

                        <FaDatabase />

                        <h2>
                            Recent Threat Activity
                        </h2>

                    </div>


                    {recentActivity.length === 0 ? (

                        <div className="empty-activity">

                            <FaCheckCircle />

                            <p>
                                No security activity recorded yet.
                            </p>

                        </div>

                    ) : (

                        <div className="activity-table">


                            {/* TABLE HEADER */}

                            <div className="activity-header">

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

                            </div>


                            {/* TABLE ROWS */}

                            {recentActivity.map((activity) => (

                                <div
                                    className="activity-row"
                                    key={activity.id}
                                >

                                    <span className="activity-type">

                                        {activity.type}

                                    </span>


                                    <span>

                                        {activity.threat_type}

                                    </span>


                                    <span
                                        className={
                                            `activity-risk ${getRiskClass(
                                                activity.risk
                                            )
                                            }`
                                        }
                                    >

                                        {activity.risk}

                                    </span>


                                    <span>

                                        {activity.risk_score}

                                    </span>


                                    <span
                                        className={
                                            activity.is_threat
                                                ? "activity-status threat"
                                                : "activity-status safe"
                                        }
                                    >

                                        {activity.is_threat
                                            ? "THREAT"
                                            : "SAFE"
                                        }

                                    </span>

                                </div>

                            ))}


                        </div>

                    )}

                </div>


                {/* =================================================
                    DATABASE STATUS
                ================================================= */}

                <div className="dashboard-database-status">

                    <FaDatabase />

                    <span>
                        Connected to CYBERGUARD MongoDB
                    </span>

                    <span className="database-online">
                        ● ONLINE
                    </span>

                </div>


            </div>

        </div>

    );

}


export default Dashboard;