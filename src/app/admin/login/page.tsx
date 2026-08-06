import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#06102b] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1330]/80 p-8">
        <h1 className="text-xl font-extrabold text-white mb-1 text-center">
          Ahmad <span className="text-[#ff6a3d]">YT</span> Tutorial
        </h1>
        <p className="text-sm text-white/50 text-center mb-6">
          Admin Panel Login
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
