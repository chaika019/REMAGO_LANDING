import type { ImgHTMLAttributes } from 'react'
import assets from '../data/optimized-assets.json' with { type: 'json' }

type OptimizedAsset = { src: string; width: number; height: number; srcSet?: string; sizes?: string }
const optimizedAssets: Record<string, OptimizedAsset> = assets

export function AssetImage({ src, srcSet, sizes, width, height, loading = 'lazy', decoding = 'async', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const asset = src ? optimizedAssets[src] : undefined
  return <img
    {...props}
    src={asset?.src ?? src}
    srcSet={srcSet ?? asset?.srcSet}
    sizes={sizes ?? asset?.sizes ?? (asset?.srcSet ? '(max-width: 900px) 100vw, 50vw' : undefined)}
    width={width ?? asset?.width}
    height={height ?? asset?.height}
    loading={loading}
    decoding={decoding}
  />
}
