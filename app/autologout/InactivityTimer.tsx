"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface InactivityTimerProps {
  idleTime?: number;
  countdownTime?: number;
  onLogout?: () => void;
}

export default function InactivityTimer({
  idleTime = 30,
  countdownTime = 30,
  onLogout,
}: InactivityTimerProps) {
  const [isIdle, setIsIdle] = useState(false);
  const [countdown, setCountdown] = useState(countdownTime);
  const lastActivityRef = useRef(Date.now());
  const idleCheckRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Debug log on mount
  useEffect(() => {
    console.log("✅ InactivityTimer mounted");
    console.log(`⏱️ Will show popup after ${idleTime} seconds of inactivity`);
  }, [idleTime]);

  const handleLogout = useCallback(() => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();

    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  }, [onLogout]);

  const resetActivity = useCallback(() => {
    console.log("🔄 Activity reset - hiding popup");
    lastActivityRef.current = Date.now();
    setIsIdle(false);
    setCountdown(countdownTime);
  }, [countdownTime]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      if (!isIdle) {
        lastActivityRef.current = Date.now();
      }
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    console.log("👂 Activity listeners attached");

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isIdle]);

  // Check for idle state
  useEffect(() => {
    idleCheckRef.current = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      const timeUntilIdle = idleTime * 1000 - timeSinceActivity;
      
      if (timeUntilIdle > 0 && timeUntilIdle < 5000) {
        console.log(`⏳ Popup in ${Math.ceil(timeUntilIdle / 1000)} seconds...`);
      }

      if (timeSinceActivity >= idleTime * 1000 && !isIdle) {
        console.log("💤 User is idle - showing popup!");
        setIsIdle(true);
        setCountdown(countdownTime);
      }
    }, 1000);

    return () => {
      if (idleCheckRef.current) {
        clearInterval(idleCheckRef.current);
      }
    };
  }, [idleTime, isIdle, countdownTime]);

  // Countdown when idle
  useEffect(() => {
    if (!isIdle) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      return;
    }

    console.log("⏰ Starting countdown...");

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        console.log(`⏰ Countdown: ${prev - 1} seconds`);
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isIdle, handleLogout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Debug: Log isIdle state changes
  useEffect(() => {
    console.log(`🔔 isIdle changed to: ${isIdle}`);
  }, [isIdle]);

  if (!isIdle) {
    return null;
  }

  return (
    <div
      className="inactivity-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Warning Icon */}
        <div
          style={{
            width: "70px",
            height: "70px",
            backgroundColor: "#FEF3C7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "12px",
            marginTop: 0,
          }}
        >
          Session Timeout Warning
        </h2>

        <p
          style={{
            color: "#6B7280",
            marginBottom: "24px",
            fontSize: "15px",
            lineHeight: "1.5",
          }}
        >
          You have been inactive. For your security, you will be automatically logged out in:
        </p>

        {/* Timer Display */}
        <div
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
            borderRadius: "12px",
            padding: "28px 24px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: "700",
              color: "#ffffff",
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "4px",
            }}
          >
            {formatTime(countdown)}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={resetActivity}
            style={{
              backgroundColor: "#059669",
              color: "#ffffff",
              padding: "16px 24px",
              borderRadius: "10px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          >
            Stay Logged In
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#F3F4F6",
              color: "#374151",
              padding: "16px 24px",
              borderRadius: "10px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E5E7EB")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}