import { AssetImage } from './AssetImage'
import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="REMAGO — на главную">
      <AssetImage loading="eager" src="/assets/remago-logo.png" alt="REMAGO Advertising & Innovations" />
    </Link>
  )
}
