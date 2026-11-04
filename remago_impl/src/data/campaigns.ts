export type Campaign = { name: string; image: string; logo?: string }

// Original creatives from the exported Partners PDF, with matching brand marks.
export const partnerCampaigns: readonly Campaign[] = [
  { name: 'Соседи', image: '/assets/partners/sosedi.png', logo: '/assets/logo-sosedi-ref.png' },
  { name: 'Geely', image: '/assets/partners/geely.png', logo: '/assets/logo-geely-ref.png' },
  { name: 'ВТБ Банк', image: '/assets/partners/vtb.png' },
  { name: 'Служба занятости', image: '/assets/partners/employment.png' },
  { name: 'Nescafé', image: '/assets/partners/nescafe.png', logo: '/assets/logo-nescafe.png' },
  { name: 'ENCATA', image: '/assets/partner-encata-poster.png', logo: '/assets/partner-logo-encata-ref.png' },
  { name: 'Банк Дабрабыт', image: '/assets/partners/dabrabyt.png', logo: '/assets/logo-dabrabyt-ref.png' },
]

// The advertising reference opens with Nescafé / Соседи / Geely.
export const advertisingCampaigns: readonly Campaign[] = [
  ...partnerCampaigns.filter((campaign) => campaign.name !== 'Nescafé'),
  partnerCampaigns[4],
]
