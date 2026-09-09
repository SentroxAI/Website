import { ImageResponse } from "next/og";

/* -------------------------------------------------------------------------- */
/*                        ROOT OG IMAGE GENERATION                            */
/* -------------------------------------------------------------------------- */

export const alt = "Sentrox AI — AI-Powered Web & Automation Solutions";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #030712 0%, #0a0f1e 50%, #030712 100%)",
                    position: "relative",
                }}
            >
                {/* Background glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-20%",
                        left: "30%",
                        width: "40%",
                        height: "60%",
                        background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        right: "20%",
                        width: "30%",
                        height: "50%",
                        background: "radial-gradient(circle, rgba(6, 182, 212, 0.10) 0%, transparent 70%)",
                        display: "flex",
                    }}
                />

                {/* Logo mark */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                        marginBottom: 32,
                    }}
                >
                    <span
                        style={{
                            fontSize: 40,
                            fontWeight: 800,
                            color: "white",
                        }}
                    >
                        S
                    </span>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        background: "linear-gradient(to right, #60a5fa, #22d3ee)",
                        backgroundClip: "text",
                        color: "transparent",
                        margin: 0,
                        lineHeight: 1.1,
                    }}
                >
                    Sentrox AI
                </h1>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: 28,
                        color: "#94a3b8",
                        margin: 0,
                        marginTop: 16,
                        fontWeight: 500,
                    }}
                >
                    AI-Powered Web & Automation Solutions
                </p>

                {/* Bottom accent line */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "linear-gradient(to right, #2563eb, #06b6d4)",
                        display: "flex",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
