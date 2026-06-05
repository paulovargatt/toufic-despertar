// src/components/SectionDivider.jsx
export default function SectionDivider() {
  return (
    <div className="relative my-6 flex items-center justify-center" aria-hidden="true">
      {/* Linha de conexão sináptica com gradiente de fadeout lateral */}
      <div
        className="h-px w-[60%] max-w-3xl"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.12) 15%, rgba(216, 180, 254, 0.45) 50%, rgba(139, 92, 246, 0.12) 85%, transparent)',
        }}
      />
      {/* Nó de sinapse brilhante no centro */}
      <div
        className="absolute h-1.5 w-1.5 rounded-full bg-white"
        style={{
          boxShadow: '0 0 10px 2px rgba(216, 180, 254, 0.85), 0 0 4px 1px rgba(255, 255, 255, 0.95)',
        }}
      />
    </div>
  )
}
