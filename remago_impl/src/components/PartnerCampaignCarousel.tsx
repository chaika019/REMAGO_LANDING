import { AssetImage } from './AssetImage'
import { Carousel } from './Carousel'
import { partnerSlides } from '../data/partnerSlides'

export function PartnerCampaignCarousel() {
  return <Carousel
    items={partnerSlides}
    label="Наши партнеры"
    getLabel={item => item.name}
    variant="poster"
    className="partner-campaign-carousel"
    getImageSources={item => [item.image, item.leftImage, item.rightImage]}
    renderItem={(item, offset) => <AssetImage
      src={offset === 0 ? item.image : offset < 0 ? item.leftImage : item.rightImage}
      alt={offset === 0 ? `LED-борд: ${item.name}` : ''}
      width={900}
      height={1500}
      decoding="async"
      draggable={false}
    />}
  />
}
