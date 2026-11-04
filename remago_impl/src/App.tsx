import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { HomePage } from './pages/HomePage'
import { PartnersPage } from './pages/PartnersPage'
import { ProductsPage } from './pages/ProductsPage'
import { RTVPage } from './pages/RTVPage'
import { ServicesPage } from './pages/ServicesPage'
import { ContactsPage } from './pages/ContactsPage'
import { FAQPage } from './pages/FAQPage'
import { NotFoundPage } from './pages/NotFoundPage'

import { ServicesAdvertisingPage } from './pages/ServicesAdvertisingPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/rtv" element={<RTVPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/advertising" element={<ServicesAdvertisingPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
