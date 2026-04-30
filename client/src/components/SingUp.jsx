import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"

export default function SingUp({ setUsername }) {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [googleUser, setGoogleUser] = useState(null)
  const [step, setStep] = useState("initial")

  function handleGoogleSuccess(credentialResponse) {
    const decoded = jwtDecode(credentialResponse.credential)
    // Block non-srmap emails
    if (!decoded.email.endsWith("@srmap.edu.in")) {
      alert("Only @srmap.edu.in email addresses are allowed.")
      return
    }
    setGoogleUser({
      email: decoded.email,
      avatar: decoded.picture,
      name: decoded.given_name || decoded.name,
    })
    setName(decoded.given_name || decoded.name || "")
    setStep("name")
  }

  function handleStart(e) {
    e.preventDefault()
    if (!name.trim()) {
      alert("Please enter your name")
      return
    }
    setUsername(name.trim())
    navigate("/chat")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { margin: 0; padding: 0; background: #0a0a0a; overflow: hidden; height: 100%; }
        #root { height: 100%; }

        #signupPage {
          height: 100vh;
          width: 100%;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          position: fixed;
          top: 0; left: 0;
          overflow: hidden;
        }

        #signupPage::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* ── Navbar ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 36px;
          z-index: 10;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #fff;
          opacity: 0.9;
        }

        .nav-logo-text {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.2px;
        }

        .nav-logo-text span {
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        .nav-badge {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px;
          padding: 4px 12px;
          letter-spacing: 0.3px;
        }

        /* ── Center content ── */
        .signup-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 0.7s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .headline {
          text-align: center;
          margin-bottom: 36px;
          line-height: 1.15;
        }
        .headline .line1 {
          display: block;
          font-size: clamp(26px, 4vw, 42px);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .headline .line2 {
          display: block;
          font-size: clamp(22px, 3.5vw, 38px);
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          letter-spacing: -0.3px;
        }

        .name-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: fadeUp 0.4s ease both;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 6px 14px 6px 8px;
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          margin-bottom: 4px;
        }
        .user-badge img {
          width: 24px; height: 24px;
          border-radius: 50%;
        }

        .name-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 18px;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          color: #fff;
          width: 260px;
          outline: none;
          transition: border-color 0.2s;
        }
        .name-input::placeholder { color: rgba(255,255,255,0.28); }
        .name-input:focus { border-color: rgba(255,255,255,0.35); }

        .start-btn {
          background: #fff;
          color: #0a0a0a;
          border: none;
          border-radius: 10px;
          padding: 12px 0;
          width: 260px;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s;
        }
        .start-btn:hover { background: #e8e8e8; transform: scale(1.02); }
        .start-btn:active { transform: scale(0.98); }
      `}</style>

      <div id="signupPage">

        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            <span className="nav-logo-text">Campus<span>Link</span></span>
          </div>
          <span className="nav-badge">Beta</span>
        </nav>

        {/* Center */}
        <div className="signup-inner">
          <div className="headline">
            <span className="line1">Verified peers.</span>
            <span className="line2">Unfiltered connections.</span>
          </div>

          {step === "initial" && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google sign-in failed")}
              useOneTap
              theme="outline"
              shape="pill"
              text="signin_with"
            />
          )}

          {step === "name" && (
            <form className="name-form" onSubmit={handleStart}>
              {googleUser && (
                <div className="user-badge">
                  <img src={googleUser.avatar} alt="avatar" />
                  {googleUser.email}
                </div>
              )}
              <input
                className="name-input"
                type="text"
                placeholder="What should we call you?"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
              <button className="start-btn" type="submit">
                Start Chatting →
              </button>
            </form>
          )}
        </div>

      </div>
    </>
  )
}