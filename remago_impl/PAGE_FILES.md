# Страницы и файлы REMAGO

| Вкладка браузера | Страница | Маршрут | Файл |
| --- | --- | --- | --- |
| Home Page | Главная | `/` | `src/pages/HomePage.tsx` |
| Partners | Партнёры | `/partners` | `src/pages/PartnersPage.tsx` |
| Products | Продукция | `/products` | `src/pages/ProductsPage.tsx` |
| RTV | RTV | `/rtv` | `src/pages/RTVPage.tsx` |
| Services | Наши услуги | `/services` | `src/pages/ServicesPage.tsx` |
| Services — Subpage 01 | Подстраница 01, размещение рекламы | `/services/advertising` | `src/pages/ServicesAdvertisingPage.tsx` |
| Contacts | Контакты | `/contacts` | `src/pages/ContactsPage.tsx` |
| FAQ | Вопросы и ответы | `/faq` | `src/pages/FAQPage.tsx` |
| Page Not Found | Страница не найдена | Любой неизвестный адрес | `src/pages/NotFoundPage.tsx` |

Общие шапка, меню, подвал и названия вкладок: `src/components/SiteLayout.tsx`.
Формы звонка, поддержки, RTV и КП: `src/components/ContactDialogs.tsx`.
Подсказки характеристик мест: `src/components/LocationCharacteristics.tsx`.
Данные 25 карточек: `src/data/advertising-location-references.json`.
Тексты «Обозначений» и ссылка Яндекс.Карт: `src/data/advertisingLegend.ts`.
Фото мест: `public/assets/services/locations/`, названия файлов соответствуют адресам.
Стили этого прохода: `src/styles/page-updates.css`; сетки главной: `src/styles/home.css`.

Файлы исходных экспортов вне проекта не переименованы. Имена ресурсов, которые уже
использовались сайтом, сохранены для совместимости с оптимизированными изображениями.
