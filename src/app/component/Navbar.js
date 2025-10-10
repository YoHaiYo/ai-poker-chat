"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStartGame = () => {
    window.location.href = "/poker";
  };

  return (
    <>
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <Link
              href="/"
              className="text-2xl font-bold text-purple-600 flex items-center hover:text-purple-800 transition-colors"
            >
              <i className="fas fa-spade mr-2"></i>AI Poker Chat
            </Link>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-slate-700 hover:text-purple-600 font-semibold text-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="text-slate-700 hover:text-purple-600 font-semibold text-lg transition-colors"
              >
                Login
              </Link>
              <button
                onClick={handleStartGame}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <i className="fas fa-play mr-2"></i>Start Game
              </button>
            </div>

            {/* 모바일 햄버거 아이콘 */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-purple-600 hover:text-purple-800"
              >
                <i className="fas fa-bars text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="container mx-auto px-6 py-6 space-y-4">
              <Link
                href="/"
                className="block text-slate-700 hover:text-purple-600 font-semibold text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/login"
                className="block text-slate-700 hover:text-purple-600 font-semibold text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <button
                onClick={() => {
                  handleStartGame();
                  setMenuOpen(false);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                <i className="fas fa-play mr-2"></i>Start Game
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
