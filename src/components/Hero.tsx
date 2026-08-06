export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/10">
      <div className="relative w-full flex items-center justify-center py-4 sm:py-6">
        <video
          src="/banner.mp4"
          poster="/banner.jpg"
          autoPlay
          muted
          loop
          playsInline
          width={1920}
          height={1080}
          style={{ aspectRatio: "16 / 9" }}
          className="w-[92%] sm:w-[90%] h-auto max-h-[75vh] object-contain object-center"
        />
      </div>
    </section>
  );
}
