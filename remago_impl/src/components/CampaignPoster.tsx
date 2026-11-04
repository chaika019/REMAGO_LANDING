import { AssetImage } from './AssetImage'
import type { Campaign } from '../data/campaigns'

export function CampaignPoster({ campaign }: { campaign: Campaign }) {
  return <article className="campaign-poster">
    <div className="campaign-poster__art"><AssetImage className={campaign.image.startsWith('/assets/partners/') ? 'campaign-poster__original' : undefined} src={campaign.image} alt={`Рекламная кампания ${campaign.name}`} decoding="async" /></div>
    <div className="campaign-poster__brand">
      {campaign.logo ? <AssetImage src={campaign.logo} alt={campaign.name} decoding="async" /> : <strong>{campaign.name}</strong>}
    </div>
  </article>
}
