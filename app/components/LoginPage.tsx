'use client';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="text-center px-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Admin Portal</h1>
        <p className="text-gray-600 mb-10 text-lg">Disaster Relief Coordination System</p>

        <button
          onClick={onLogin}
          className="px-10 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
