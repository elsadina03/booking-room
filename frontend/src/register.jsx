import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./register.css";

export default function Register({ onSwitchToLogin }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nama || !email || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("password", password);

      const res = await fetch("http://localhost/magang/booking-room/backend/auth/register.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setNama("");
        setEmail("");
        setPassword("");
        setRememberMe(false);

        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      alert("Terjadi kesalahan saat register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-overlay"></div>

      <div className="register-card">
        <h1 className="register-title">Register</h1>
        <p className="register-subtitle">
          Buat akun untuk lanjut ke dashboard booking ruangan
        </p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="register-input"
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
            />
          </div>

          <div className="input-group password-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
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

          <label className="remember-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Sudah punya akun?{" "}
          <button
            type="button"
            className="text-link"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}