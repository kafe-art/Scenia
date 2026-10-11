const ESTADOS = {
  otorgado: ['ok', 'Consentimiento otorgado'],
  pendiente: ['warn', 'Consentimiento pendiente'],
  revocado: ['bad', 'Consentimiento revocado'],
}

export default function ConsentBadge({ estado }) {
  const [tono, texto] = ESTADOS[estado] || ESTADOS.pendiente
  return <span className={`dc-pill ${tono}`}>{texto}</span>
}
