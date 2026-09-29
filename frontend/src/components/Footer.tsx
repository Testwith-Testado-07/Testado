import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const MINT = "#C2EFD4";

  return (
    <footer
      style={{
        background: "#101828",
        color: "#ffffff",
        padding: "64px 40px 32px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 6,
                  padding: 4,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/assets/testado-logo-transparent.png"
                  alt="Testado"
                  width={1531}
                  height={382}
                  style={{ width: 170, height: "auto", display: "block" }}
                />
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 360 }}>
              We help businesses make better launch decisions using structured testing and real customer feedback.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: 18,
              }}
            >
              Explore
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <Link href="/why-testado" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                Why Testado
              </Link>
              <Link href="/businesses" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                For Businesses
              </Link>
              <Link href="/testers" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                Become a Tester
              </Link>
              <Link href="/about" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                About Testado
              </Link>
              <Link href="/contact" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
                Contact
              </Link>
            </div>
          </div>

          {/* Direct Channels */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: 18,
              }}
            >
              Direct Connect
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <a
                href="https://www.instagram.com/testwithtestado/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: MINT, textDecoration: "none", fontWeight: 600 }}
              >
                Instagram — @testwithtestado ↗
              </a>
              <a href="tel:+919325694956" style={{ color: "#ffffff", textDecoration: "none", fontWeight: 600 }}>
                +91 9325694956
              </a>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                Evenings: 5:00 PM – 11:30 PM IST
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div>© 2026 Testado. All rights reserved.</div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>
            No payments are currently made through this website.
          </div>
        </div>
      </div>
    </footer>
  );
}
