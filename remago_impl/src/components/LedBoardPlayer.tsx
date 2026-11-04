import { useEffect, useRef, useState } from 'react'
import { channelVideos, hasVideo, mediaUrl, videoSource } from '../data/rtv-media'
import type { RtvChannel } from '../data/rtv-media'

type Props = { channel: RtvChannel; title: string; onClose: () => void }

export function LedBoardPlayer({ channel, title, onClose }: Props) {
  const videos = channelVideos(channel).filter(hasVideo)
  const [active, setActive] = useState(0)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)
  const playerRef = useRef<HTMLVideoElement>(null)
  const video = videos[active]
  const [mobile] = useState(() => {
    if (typeof window === 'undefined') return false
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    return window.matchMedia('(max-width: 900px)').matches || Boolean(connection?.saveData) || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? '')
  })
  const source = video && videoSource(video, mobile ? 'mobile' : 'desktop')

  useEffect(() => {
    const player = playerRef.current
    if (!player || !source) return
    let cancelled = false
    if (player.getAttribute('src') !== source) player.src = source
    setFailed(false)
    setNeedsPlay(false)
    void player.play().catch(() => { if (!cancelled) setNeedsPlay(true) })
    const pauseWhenHidden = () => { if (document.hidden) player.pause() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => !entry.isIntersecting)) player.pause()
    })
    observer.observe(player.closest('.channel-card, .rtv-hero-stage') ?? player)
    return () => {
      cancelled = true
      observer.disconnect()
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      player.pause()
      player.removeAttribute('src')
      player.load()
    }
  }, [source])

  const move = (step: number) => setActive(index => (index + step + videos.length) % videos.length)

  return <div className="led-player" role="group" aria-label={title}>
    <div className="led-player__board-area">
      <div className="led-board-frame">
        <span className="led-board-frame__camera" aria-hidden="true" />
        <div className="led-board-frame__cabinet">
          <div className="led-board-frame__header" aria-hidden="true"><span>ϟ ЗАРЯДКА</span><b>ВНИМАНИЕ!</b></div>
          <span className="led-board-frame__brand" aria-hidden="true">WWW.REMAGO.BY</span>
          <div className="led-board-frame__screen">
            {source ? <video
              ref={playerRef}
              src={source}
              poster={video.poster ? mediaUrl(video.poster) : undefined}
              controls
              playsInline
              autoPlay
              muted={muted}
              preload="metadata"
              loop={videos.length === 1}
              aria-label={video.title}
              onPlay={() => setNeedsPlay(false)}
              onVolumeChange={event => setMuted(event.currentTarget.muted)}
              onError={() => setFailed(true)}
              onEnded={() => { if (videos.length > 1) move(1) }}
            /> : <p className="led-player__empty">Видео этого канала<br />скоро появятся</p>}
            {source && (failed || needsPlay) && <button type="button" className="led-player__retry" onClick={() => {
              const player = playerRef.current
              if (!player) return
              if (failed) { setFailed(false); player.load() }
              void player.play().catch(() => setNeedsPlay(true))
            }}>{failed ? 'Повторить загрузку' : '▶ Смотреть видео'}</button>}
          </div>
          <span className="led-board-frame__footer" aria-hidden="true">REMAGO · RTV</span>
        </div>
      </div>
    </div>
    <div className="led-player__controls">
      {video && <>
        <span className="led-player__title" aria-live="polite">{video.title}</span>
        <div className="led-player__buttons">
          {videos.length > 1 && <button type="button" onClick={() => move(-1)} aria-label="Предыдущий ролик">←</button>}
          <button type="button" onClick={() => {
            setMuted(value => !value)
            if (playerRef.current) {
              playerRef.current.muted = !muted
              void playerRef.current.play().catch(() => setNeedsPlay(true))
            }
          }} aria-pressed={!muted} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>{muted ? 'Звук' : 'Без звука'}</button>
          {videos.length > 1 && <button type="button" onClick={() => move(1)} aria-label="Следующий ролик">→</button>}
        </div>
      </>}
      <button type="button" className="led-player__close" onClick={onClose}>Вернуться к маскоту</button>
    </div>
  </div>
}
