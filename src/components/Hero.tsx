export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/10">
      <div className="relative w-full bg-[#06102b] flex items-center justify-center py-4 sm:py-6">
        <video
          src="/banner.mp4"
          poster="/banner.jpg"
          autoPlay
          muted
          loop
          playsInline
          className="w-[92%] sm:w-[90%] h-auto max-h-[75vh] object-contain object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06102b] via-transparent to-transparent" />
      </div>
    </section>
  );
}
