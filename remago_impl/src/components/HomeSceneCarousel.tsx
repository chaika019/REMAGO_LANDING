import { AssetImage } from './AssetImage'
import { Carousel } from './Carousel'

export type HomeScene = { image: string; sideImage: string; label: string }

export function HomeSceneCarousel({ items }: { items: readonly HomeScene[] }) {
  return <Carousel
    items={items}
    label="Примеры использования SMART-бордов"
    getLabel={item => item.label}
    variant="scene"
    className="home-scenes"
    getImageSources={item => [item.image, item.sideImage]}
    renderItem={(item, offset) => <AssetImage
      className="smart-scene"
      src={offset === 0 ? item.image : item.sideImage}
      alt={offset === 0 ? `SMART-борд: ${item.label}` : ''}
      width={1696}
      height={1272}
      decoding="async"
      draggable={false}
    />}
  />
}
