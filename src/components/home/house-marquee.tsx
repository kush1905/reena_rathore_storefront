const PHRASES = ["Silk", "Gota patti", "Zardozi", "Kundan", "Banarasi", "Chikankari", "Reena Rathore", "Private appointments"];

export function HouseMarquee() {
  const line = [...PHRASES, ...PHRASES, ...PHRASES];
  return (
    <div className="overflow-hidden border-y border-[#2c2622] bg-[#14110f] py-4">
      <div className="marquee-track flex w-max items-center">
        {line.map((phrase, i) => (
          <span key={`${phrase}-${i}`} className="flex items-center">
            <span className="px-7 font-display text-[1.05rem] tracking-[0.08em] text-accent italic">{phrase}</span>
            <span className="mx-1 size-1 rounded-full bg-accent/55" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
