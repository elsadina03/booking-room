import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./login.css";

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("http://localhost/magang/booking-room/backend/auth/login.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">
          Masuk untuk lanjut ke dashboard booking ruangan
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="input-group password-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Belum punya akun?{" "}
          <button
            type="button"
            className="text-link"
            onClick={onSwitchToRegister}
          >
            Daftar
          </button>
        </p>
      </div>
    </div>
  );
}