import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1330]/85 backdrop-blur p-8 shadow-[0_0_60px_-15px_rgba(59,130,246,0.4)]">
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
