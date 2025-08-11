"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavButton() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const target = isHome ? "/store" : "/";
  const label = isHome ? "매장 페이지로 이동" : "홈으로 이동";
  return (
    <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
      <Link href={target}>
        <button
          style={{
            padding: "8px 16px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      </Link>
    </div>
  );
} 