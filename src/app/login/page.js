"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // 구글 로그인 로직 (실제 구현은 나중에)
    setTimeout(() => {
      setIsLoading(false);
      // 로그인 성공 시 홈으로 이동
      window.location.href = "/";
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* 로고 및 제목 */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-lg w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <i className="fas fa-spade text-4xl text-purple-600"></i>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-lg">
              Sign in to continue your poker journey
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="bg-white rounded-lg shadow-xl p-8 border border-slate-200">
            <div className="space-y-6">
              {/* 구글 로그인 버튼 */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white border-2 border-slate-300 text-slate-700 py-4 px-6 rounded-lg font-semibold text-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin mr-3"></i>
                ) : (
                  <i className="fab fa-google mr-3 text-red-500"></i>
                )}
                {isLoading ? "Signing in..." : "Continue with Google"}
              </button>

              {/* 구분선 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or</span>
                </div>
              </div>

              {/* 게스트 로그인 */}
              <button
                onClick={() => (window.location.href = "/poker")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                <i className="fas fa-user-secret mr-3"></i>
                Continue as Guest
              </button>
            </div>

            {/* 추가 정보 */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                By signing in, you agree to our{" "}
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* 홈으로 돌아가기 */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-purple-600 font-semibold text-lg transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
