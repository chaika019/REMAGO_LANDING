import { AssetImage } from './AssetImage'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from './Icon'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

type DialogKind = 'callback' | 'support' | 'rtv' | 'proposal' | null

function composeEmail(subject: string, body: string) {
  window.location.href = `mailto:remago@bk.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function ContactDialogs() {
  const [kind, setKind] = useState<DialogKind>(null)
  const [status, setStatus] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  useBodyScrollLock(kind !== null)

  useEffect(() => {
    const kinds = ['callback', 'support', 'rtv', 'proposal'] as const
    const handlers = kinds.map(dialogKind => {
      const handler = () => { setStatus(''); setKind(dialogKind) }
      window.addEventListener(`remago:${dialogKind}`, handler)
      return { dialogKind, handler }
    })
    return () => handlers.forEach(({ dialogKind, handler }) => window.removeEventListener(`remago:${dialogKind}`, handler))
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!kind || !dialog) return
    dialog.showModal()
    return () => {
      dialog.close()
    }
  }, [kind])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (kind !== 'support') {
      const phoneInput = event.currentTarget.elements.namedItem('phone') as HTMLInputElement
      const digitCount = String(data.get('phone')).replace(/\D/g, '').length
      if (digitCount < 7 || digitCount > 15) {
        phoneInput.setCustomValidity('Введите номер телефона, содержащий от 7 до 15 цифр')
        phoneInput.reportValidity()
        return
      }
      composeEmail(kind === 'rtv' ? 'Заявка RTV' : kind === 'proposal' ? 'Заявка на коммерческое предложение' : 'Заявка на звонок REMAGO', `Имя: ${data.get('name')}\nТелефон: ${data.get('phone')}\nОрганизация: ${data.get('organization') || '—'}\nEmail: ${data.get('email') || '—'}\nКомментарий: ${data.get('message') || '—'}`)
    } else {
      composeEmail('Вопрос в службу поддержки REMAGO', String(data.get('message')))
    }
    setStatus('Откроется почтовое приложение с подготовленным письмом. Отправьте его, чтобы мы получили обращение.')
  }

  if (!kind) return null

  return <dialog
    ref={dialogRef}
    className={`contact-dialog contact-dialog--${kind}`}
    aria-labelledby="contact-dialog-title"
    onCancel={() => setKind(null)}
    onClose={() => setKind(null)}
    onClick={(event) => { if (event.target === event.currentTarget) setKind(null) }}
  >
    <div className="contact-dialog__surface">
      <button type="button" className="contact-dialog__close" onClick={() => setKind(null)} aria-label="Закрыть"><Icon name="close" size={28} /></button>
      <header className="contact-dialog__header">
        {kind === 'support' && <AssetImage src="/assets/design/support-avatar.png" alt="" />}
        <h2 id="contact-dialog-title">{kind === 'rtv' ? 'ФОРМА РТВ' : kind === 'proposal' ? 'Заявка на КП' : kind === 'callback' ? 'Заказать звонок' : 'Служба поддержки'}</h2>
        {kind === 'support' && <p>Свяжитесь с нами</p>}
      </header>
      {kind !== 'support' ? <form className="callback-form" onSubmit={submit}>
        <label>Имя<input name="name" autoComplete="name" required maxLength={100} /></label>
        <label>Номер телефона<input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9\(\)\s\-]{7,25}" title="Введите номер телефона, от 7 до 25 символов" onInput={(event) => event.currentTarget.setCustomValidity('')} /></label>
        <label>Название организации<input name="organization" autoComplete="organization" maxLength={150} /></label>
        {(kind === 'rtv' || kind === 'proposal') && <>
          <label>Электронная почта<input name="email" type="email" autoComplete="email" required maxLength={150} /></label>
          <label>{kind === 'rtv' ? 'Расскажите о вашем контенте' : 'Расскажите о вашей задаче'}<textarea name="message" rows={3} maxLength={3000} /></label>
        </>}
        <button type="submit" className="button button--primary">Отправить</button>
        <p className="contact-dialog__note">Заявка отправляется через ваше почтовое приложение.</p>
        <AssetImage className="callback-form__mascot" src="/assets/design/callback-mascot.png" alt="" />
      </form> : <div className="support-panel">
        <button type="button" className="support-panel__back" onClick={() => setKind(null)}>← Вернуться на страницу</button>
        <div className="support-panel__illustration" aria-hidden="true">
          <span><Icon name="phone" size={66} /></span>
          <span><Icon name="mail" size={66} /></span>
          <span><Icon name="telegram" size={66} /></span>
        </div>
        <div className="support-panel__greeting"><AssetImage src="/assets/design/support-avatar.png" alt="" /><p>Здравствуйте!<br />Задавайте ваш вопрос,<br />будем рады ответить!</p></div>
        <form className="support-panel__form" onSubmit={submit}>
          <label className="visually-hidden" htmlFor="support-message">Ваш вопрос</label>
          <textarea id="support-message" name="message" placeholder="Введите сообщение..." required maxLength={3000} rows={2} />
          <button type="submit" aria-label="Подготовить письмо в поддержку"><Icon name="telegram" size={48} /></button>
        </form>
        <p className="contact-dialog__note">Сообщение отправляется через ваше почтовое приложение.</p>
      </div>}
      {status && <p className="contact-dialog__status" role="status">{status}</p>}
    </div>
  </dialog>
}
