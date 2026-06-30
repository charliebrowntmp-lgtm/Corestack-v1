const PALETTES = [
  { bg: '#f0fdf4', text: '#166534' },
  { bg: '#eff6ff', text: '#1e40af' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#fdf4ff', text: '#7e22ce' },
  { bg: '#fff1f2', text: '#be123c' },
  { bg: '#f0f9ff', text: '#0369a1' },
  { bg: '#fefce8', text: '#854d0e' },
  { bg: '#f5f5f4', text: '#292524' },
  { bg: '#ecfdf5', text: '#065f46' },
  { bg: '#eef2ff', text: '#3730a3' },
]

function palette(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PALETTES[Math.abs(h) % PALETTES.length]
}

function initials(name: string) {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

interface Props {
  company: string
  size?: number
}

export default function CompanyLogo({ company, size = 36 }: Props) {
  const { bg, text } = palette(company)
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: text,
        fontSize: Math.round(size * 0.38),
        flexShrink: 0,
      }}
      className="flex items-center justify-center font-semibold border border-black/10"
    >
      {initials(company)}
    </div>
  )
}
