# REMAGO — reference audit

По запросу пользователя исправлены пропорции маскота формы и заменены видео-диалоги RTV на встроенные фронтальные LED-борды с переворотом карточек. Порядок роликов сохранён. Изменения и ограничения проверки: [RTV_INLINE_UPDATE.md](RTV_INLINE_UPDATE.md).

Повторный проход после пользовательской проверки: исправлены конфликтующие высоты карточек и фото адресов, мобильные блоки RTV, подсказки и переходы. Свежие подробности и ограничения проверки — в начале [RESPONSIVE_AUDIT.md](RESPONSIVE_AUDIT.md).

## Адаптивная вёрстка — 19 октября 2026

Добавлен финальный слой правил для телефонов, планшетов и ноутбуков; исправлены переполнение CTA RTV, узкие сетки, размещение иллюстраций и управление адресами. Подготовлен браузерный прогон на 16 размерах, но сервер заблокирован `EPERM`. Проверки сборки/структуры проходят; живая визуальная приёмка не завершена. Подробности: [RESPONSIVE_AUDIT.md](RESPONSIVE_AUDIT.md).

## Сверка и UI/UX — 19 октября 2026

Повторно просмотрены шесть PNG и извлечены тексты двух PDF; исправлены меню, фокус, блокировка прокрутки диалогов, семантика RTV и пустые ссылки. Добавлены responsive-варианты новых слайдеров и офлайн-проверка девяти маршрутов. Все доступные проверки проходят; performance запущен, но preview заблокирован `EPERM`. Свежих браузерных времён и скриншотов нет. Подробности и размеры до/после: [REVIEW_REPORT_2026-10-19.md](REVIEW_REPORT_2026-10-19.md).

## Изменения 14 октября 2026

Названия страниц и вкладок, сетки главной, слайдеры продукции, раскрытие каналов RTV, формы RTV/КП, кликабельные услуги, 25 карточек адресов с подсказками и переход в Яндекс.Карты реализованы. Проверки и ограничения: [отчёт](REVIEW_REPORT_2026-10-14.md). Навигатор файлов: [PAGE_FILES.md](PAGE_FILES.md).

## Скорость всех страниц — 11 октября 2026

Оптимизированы изображения без замены композиции, добавлены варианты по размеру экрана и отложенная загрузка нижних ресурсов. Сохранены исходники, текст FAQ и геометрия CSS. Рекламная страница/Leaflet отделена от начального пакета. TypeScript, build, проверки FAQ/слайдеров и серверная сверка текстов девяти маршрутов проходят. Фактические 3 секунды на 4G не подтверждены из-за недоступного браузера; проверенные размеры и инструкции для production-замера: [PERFORMANCE_AUDIT.md](PERFORMANCE_AUDIT.md).

## Сглаживание текста — 11 октября 2026

Убраны лишние 3D-трансформации и постоянные `will-change` каруселей, трансформации центрирования карточек, движение текстовых кнопок при наведении и perspective вокруг подписей RTV. Размеры и типографика сохранены. В статичном FAQ опасные свойства на родителях не обнаружены; его конкретный дефект визуально не подтверждён. Подробности и ограничения проверки при zoom 100%: [TEXT_RENDERING_AUDIT.md](TEXT_RENDERING_AUDIT.md).

## Тексты FAQ — 11 октября 2026

Повторная дословная сверка по скачанным PDF и PNG: второй вопрос возвращён на LED-BOARD по уточнению пользователя; начало первого ответа возвращено на LED-BOARD по исходнику. Остальные шесть ответов совпадают с PDF. Первый вопрос SMART-BOARD сохранён по предыдущему указанию пользователя, хотя скачанные экспорты содержат LED-BOARD. Добавлена проверка `npm run check:faq`; все ответы и вопросы (с этим единственным явным исключением) проверены в данных и раскрытой серверной разметке. Источники, подтверждения и ограничение доступа к актуальной Figma: [FAQ_COPY_AUDIT.md](FAQ_COPY_AUDIT.md). Следующая запись описывает предыдущий проход; замена начала первого ответа на SMART-BOARD отменена.

По уточнению пользователя название в первых двух вопросах и начале первого ответа заменено с LED-BOARD на SMART-BOARD. Другие упоминания LED-экранов и LED-бордов в ответах сохранены: они присутствуют в полученных слоях Figma, а замена типа оборудования без нового исходника не подтверждена.

Успешно прочитаны метаданные страницы FAQ `1370:1160` файла `TdTHTyRywxNI2u5KmL27ia`, включая состояния с ответами. В доступной копии эти два вопроса ещё содержат LED-BOARD; указание пользователя имеет приоритет. Остальные пять вопросов и содержательная часть семи ответов совпадают с полученными текстовыми слоями.

Обнаружено дополнительное расхождение категорий: Figma относит AI-аналитику и RTV к «Продукции». Категории исправлены: четыре вопроса продукции, два услуг и один оплаты. Порядок всех семи вопросов сохранён.

Последующие запросы `get_metadata` и `get_design_context` отклонены из-за лимита MCP на тарифе Starter. `whoami` подтвердил тариф. Текущий screenshot и содержимое вложенных компонентов первого экрана/категорий получить не удалось; полное совпадение всей страницы с обновлённым макетом не заявляется. Пользователю отправлено уточнение об актуальной ссылке на FAQ.

## Плавность слайдеров — 11 октября 2026

По отдельному запросу пользователя изменена механика слайдеров, включая главную и «Партнёров». Их контент и исходные варианты иллюстраций сохранены. Добавлены переходы длительностью 400 мс через `transform`/`opacity`, предварительная загрузка и декодирование изображений, последовательное завершение анимаций с сохранением последнего запроса и поддержка `prefers-reduced-motion`.

Общая логика применяется к сценам главной, партнёрам, рекламным кампаниям, карточкам адресов и типам продукции. Для обоих типов продукции закреплена одинаковая высота области изображения на каждом размере экрана. В каруселях со свайпом вертикальная прокрутка и мультитач отменяют распознавание перелистывания.

`npm run check:carousels`: восемь проверок логики проходят. TypeScript, production build и серверный рендер маршрутов проходят; локальные изображения доступны. Проверка фактической плавности в браузере по-прежнему ограничена средой, описанной в отчёте предыдущего прохода.

## Сверка 11 октября 2026 — остальные страницы

Главная и «Партнёры» сохранены по последним записям индивидуальных доработок. Остальные страницы проверены по локальным PNG/PDF. Исправлены направление кнопки возврата, лишняя стрелка FAQ, размеры наружного борда, адаптивная компоновка характеристик/каналов RTV, активация RTV-карточек и обработка повреждённого кэша карты. Все новые CSS-правила ограничены соответствующими секциями.

TypeScript, production build, серверный рендер и проверка локальных изображений проходят. Браузерная сверка остаётся недоступной из-за ограничений среды. Источники, точный список изменений, подтверждённые проверки и ограничения приведены в [отчёте](REVIEW_REPORT_2026-10-11.md).

## Дополнительная сверка 5 октября 2026 — по PNG/PDF из files_for_site

Источники: шесть полноразмерных PNG из `Сайт ООО _Ремаго_ (8)`, `Контакты.pdf`, `Подстраница 01.pdf`, отдельные PDF главной/партнеров/RTV и оригинальные PNG ресурсов. Для рекламной страницы учитываются внешние поля PDF: его ширина 1706 pt не равна ширине фрейма. Ссылка на Figma для этого прохода не используется.

### Исправления

- Общая шапка: выравнивание логотипа и навигации по вертикали, правый отступ и исходный значок языка. Геометрия desktop ограничена соответствующими media queries; мобильное меню сохранено.
- Главная: переносы описания, интервалы строк и положение кнопки первого экрана, размеры подписей статистики и секционных заголовков. При скрытии desktop-переносов слова больше не склеиваются.
- Продукция: устранены более специфичные старые правила, которые удерживали иллюстрацию на 500 px и текст типов бордов на 28 px. На desktop используются 650 px и 32 px. В характеристиках восстановлены размер подписи, линии вокруг заголовка, центральное выравнивание текста и положение исходных иконок с тенями. Установлен оригинальный PNG борда.
- Услуги: оригинальный PNG борда и контурная галочка из экспорта вместо текстового символа.
- Контакты: четыре исходных заполненных значка вместо отличающихся контурных SVG.
- Партнеры: межстрочный интервал CTA приведен к исходной композиции.
- RTV: размеры заголовков, подписей принципов и межстрочный интервал описаний каналов. Hover/tap/keyboard flip и отключенные источники видео сохранены.
- Рекламная страница: заголовок первого экрана привязан к верхней части сетки; исправлены размеры иллюстрации и желтого круга. До 1100 px адреса располагаются в одной колонке; FAQ на этих ширинах использует две колонки категорий.

### Новые исходные ресурсы

Все файлы расположены в `public/assets/design/`:

- `product-board.png`: копия `Сайт ООО _Ремаго_ (8)/Лед борд-1.png`, 290 × 607.
- `service-board.png`: копия `Сайт ООО _Ремаго_ (8)/Лед борд.png`, 151 × 263.
- `language-globe.png`: только значок из `Home page.png`, область `(1517, 65)–(1570, 119)`.
- `service-check.png`: только галочка из `Наши услуги.png`, область `(109, 1411)–(137, 1439)`.
- `contact-phone/mail/telegram/at.png`: только значки из `Контакты.pdf`, отрендеренного с исходной шириной 1600 px; области `(112, 974)–(254, 1116)`, `(859, 974)–(1001, 1116)`, `(112, 1300)–(254, 1442)`, `(859, 1300)–(1001, 1442)` соответственно.

Текст, кнопки, карточки и страницы остаются HTML; экспорты целых страниц не используются как фон сайта.

### Проверка

- `npm run typecheck` и `npm run build` проходят.
- Серверный рендер восьми маршрутов и 404: по одному `<main>`, проверено 101 место использования изображений. Leaflet при серверном рендере подменен пустым модулем; это не является проверкой работающей карты.
- Все 65 различных статических путей к изображениям в коде существуют; восемь новых PNG декодируются и имеют ненулевой размер. Пути динамических иконок дополнительно проверены в отрендеренной разметке.
- В начальной разметке сохранены 25 адресов, пять карточек RTV и семь вопросов FAQ.
- Статический разбор CSS-каскада на 1600, 1200, 1000, 768 и 390 px подтверждает выбор исправленных размеров иллюстрации продукции, подписей, заголовков RTV и адаптивных сеток. Это не заменяет браузерную проверку геометрии.
- Визуальная проверка реализации и интерактивных действий в браузере недоступна в этой среде: Vite возвращает `listen EPERM`, Chromium — `shutdown: Operation not permitted`. Совпадение пиксель в пиксель не заявляется. Отличия Leaflet от Яндекс.Карты и отправки форм через mailto сохраняются.

## Сверка 5 октября 2026 — переделка по архивам files_for_site

Основной источник геометрии — сводный архив `Сайт ООО _Ремаго_ (8).zip`: экспортированные страницы шириной 1600 px. Остальные восемь архивов распакованы и просмотрены для дополнительных состояний FAQ, поддержки, заявки на звонок и отдельных ресурсов. PDF рекламной страницы имеет внешнее поле вокруг макета; размер PDF не используется как ширина сайта.

### Изменения

- Добавлен `src/styles/design.css`: общий desktop baseline, размеры и интервалы восьми страниц, отдельные правила для промежуточных размеров, планшетов и телефонов.
- Главная: исходная декоративная композиция первого экрана, три SMART-сцены из сводного PNG (магазин / кафе / медицинский центр), пропорции блока о компании и CTA. Иллюстрация лифта сохранена в assets.
- Партнеры и услуги: размеры трех слайдов, карточек и кнопок, исходные декоративные волны и интервалы до футера.
- Продукция: переключение внутреннего и наружного бордов, исходные восемь экспортированных иконок характеристик, геометрия схемы и блока принципа работы.
- RTV: изображения пяти карточек извлечены из экспортированного RTV.png вместе с оригинальными логотипами и фонами. Сохраняются hover/tap/keyboard flip и отключенные видео.
- Контакты: исходная композиция маскота с желтым кругом; размеры карточек; кнопка поддержки открывает диалог.
- FAQ: исходные иконки, ответы из `FAQ(все вопросы + ответы).pdf`, независимое раскрытие ответов и совместный выбор категорий. Добавлены ARIA-связи вопросов и ответов.
- Рекламная страница: адресная таблица, блок вакансий и тарифы переведены из растровых секций в HTML. Выбор строки меняет карточку адреса. Восстановлена композиция блока карты с заголовком слева и маскотом.
- Добавлены диалоги заявки на звонок и поддержки, валидация номера телефона, закрытие по Escape и фону, удержание фокуса штатным HTML dialog. Отправка готовит письмо в почтовом приложении; автоматическая отправка и онлайн-чат не заявляются.

### Источники новых assets

`public/assets/design/` содержит иллюстрации и иконки, а не скриншоты страниц с текстом/кнопками:

- `home-hero.png`: декоративная область Home page.png, x=880..1600, y=152..822; соседний фрагмент заголовка исключен.
- `faq-hero.png`: правая иллюстрация FAQ(все вопросы).png, x=950..1600, y=190..800.
- `contacts-hero.png`: правая иллюстрация Контакты.pdf, отрендеренного с шириной 1600 px.
- `rtv-*.png`: пять отдельных иллюстраций карточек RTV.png, исходные фоны и логотипы сохранены.
- `spec-*.png`: оригинальные Group 48/49/50/51/52/53/54/55.png.
- `faq-all/product/services/payment.png`: контуры иконок из соответствующих кнопок FAQ(все вопросы).png; фон отделен, чтобы категории корректно отображались в активном и неактивном состояниях.
- `callback-mascot.png`: оригинальное изображение и alpha mask из заявки на звонок.pdf, архив (6).
- `support-avatar.png`: аватар из Служба поддержки.png, архив (2).
- `vacancy-board.png`, `vacancy-map-icon.png`, `tariff-clock.png`: отдельные иллюстрации из уже находящихся в проекте оригинальных экспортов рекламной страницы.

### Подтвержденная проверка и ограничения

- `npm run typecheck` — успешно.
- `npm run build` — успешно.
- Серверный рендер всех восьми страниц и 404; по одному main landmark на маршрут.
- Проверены 165 локальных ссылок на ресурсы в отрендеренной разметке, 75 статических путей из исходников, декодирование всех 25 новых PNG, семь вопросов FAQ, 25 строк адресов и пять карточек RTV.
- Проверено, что pattern номера телефона компилируется с флагом Unicode Sets (`v`), принимает форматированные белорусские номера и отклоняет буквенный ввод.
- При серверной проверке Leaflet подменен пустым модулем: это проверяет разметку рекламной страницы, но не работоспособность карты в браузере.
- Браузерная проверка НЕ выполнена: запуск Vite завершается `listen EPERM`, Chromium — `setsockopt: Operation not permitted`. Ни desktop/mobile screenshots реализации, ни pixel diff не получены. Совпадение 1 в 1 не подтверждено.
- Карта остается Leaflet/OpenStreetMap. Ее подложка и элементы управления отличаются от Яндекс.Карты в референсе. Координаты загружаются существующим геокодером; при неполной загрузке показана ссылка для поиска выбранного адреса.
- Backend отсутствует. Формы используют mailto, а не имитируют доставку заявки или ответ оператора. Видео намеренно не подключены согласно README.

## Сверка 3 октября 2026

- Источник: PNG/PDF из `../files_for_site`, включая `Home page.pdf`, `Партнеры.pdf`, `Продукция.png` и `Наши услуги.png`.
- Прямой доступ к исходному Figma-файлу через коннектор отклонён: подключённому аккаунту требуются права редактора. Этот проход выполнен по экспортам.
- Главная и блок характеристик продукции переведены с картинок целых секций на текст, изображения и кнопки в React.
- Общий слайдер сохраняет геометрию карточек, поддерживает клавиатуру, свайп и выбор точками.
- SMART-сцены: кафе, медицинский центр, лифт и магазин. Медцентр и магазин извлечены из оригинальных изображений PDF; изображения не растягиваются и не обрезаются.
- Рекламные борды шести брендов извлечены из исходного изображения в `Партнеры.pdf`; дополнительный ENCATA использует существующий оригинальный постер.
- Исправлена ошибочная пара «МТБанк — реклама Дабрабыта». Стартовые композиции: Дабрабыт / Соседи / Geely на странице партнеров и Nescafé / Соседи / Geely на рекламной странице.
- Зафиксирована высота всех 25 карточек адресов; отсутствующие фотографии не заменяются снимком другого магазина.
- Видео и логика карты сохранены; Яндекс.Карта не подключалась.
- Проверены TypeScript, production build, серверный рендер восьми страниц, все рекламные слайды и локальные пути изображений.
- Визуальный браузерный проход не выполнен: среда запрещает запуск локального сервера и Chromium. Размеры и адаптивные правила требуют финальной проверки в обычном браузере.

Сборка сверялась с доступными Figma-фреймами и reference-assets, которые уже находятся в проекте.

## Figma structure

В подключенной копии Figma подтверждены основные desktop-фреймы 1600 px:

- Home page — `1480:4336`
- Наши услуги — `1480:5349`
- Подстраница 01 — `1480:7175`
- Партнеры — `1480:8273`
- RTV — `1480:8946`
- Контакты — `1480:10409`
- Продукция — `1480:10533`
- FAQ — `1480:10697`

## Что сделано в этой сборке

- сохранены все основные маршруты и макетные assets;
- исправлена невалидная вложенность `<main>` на главной;
- видео полностью отключены до отдельного этапа согласования;
- удалён YouTube runtime/config из production-кода;
- RTV переведён с desktop-картинки страницы на живую React/CSS-разметку;
- для пяти RTV-каналов сделана 3D flip-механика: hover на desktop и tap на touch/mobile;
- обратная сторона RTV-карточек подготовлена как video-slot без источника видео;
- play-зоны на рекламной подстранице оставлены визуально, но временно неактивны;
- сохранены 25 локаций и интерактивная карта;
- проверены ссылки на локальные assets — отсутствующих файлов нет.

## Видео

Видео не являются зависимостью текущей версии. После согласования источника роликов можно подключить видео к готовым слотам без переделки RTV-сетки и карточек.

### Home page correction — folder 7 (2026-10-05)

Only the home route was changed. The other route components and shared styles/components were preserved; `home.css` is imported last and every selector starts with `.home-page`.

- Source: `files_for_site/Сайт ООО _Ремаго_ (7)/Home page.pdf` and its 33 MB `Pasted image.png`.
- Replaced the three old slider images with all nine central/side artwork pairs, exported to WebP at 1696 × 1272. The original side versions retain their faded appearance; CSS no longer adds opacity or scales them down. Controls support arrows, dots, keyboard and touch.
- Hero illustration was extracted from the original PDF graphics at twice the display resolution, with transparency. Its right edge follows the viewport edge on desktop.
- Partner logos and the complete mountain artwork were extracted as vectors from the PDF, without the former card-shaped cutouts or embedded logo separator lines. Mountains are anchored to the partner grid.
- About label and curved `innovation` lettering use the original PDF vector outlines. Hand, medal, head, mascot and callback telephone use the original PDF images with alpha masks. Removed the old home callback background.
- Validation: TypeScript and production build passed. Server-rendered markup of all eight other routes matched their existing snapshots. All home asset references resolve; all nine slide selectors render; all new CSS selectors are scoped to the home route. Browser visual/interaction validation could not be performed in this sandbox, where browser startup and local listening ports are restricted.

### Callback corner and partner carousel refinement (2026-10-06)

- Home change is limited to the callback block: extracted the small complete yellow network from `Home page.pdf` and anchored it to the requested lower-left corner. Existing home content and slider were preserved.
- Callback input padding now uses the same 11% horizontal inset as the ends of the centered 78% yellow underline, including mobile sizes.
- Partners use all eight sets from folder 4's updated `Pasted image.png`: Соседи, Geely, Nescafé, Служба занятости, Банк Дабрабыт, МТБанк, Три цены, КерамОмТорг. Extracted complete central/left/right cards including the original warning strips, cameras and logos. Assets are 900 × 1500, and the desktop central card is wider (40% of the stage). Removed the previous additional fading and camera mask by using a dedicated carousel for these full reference cards.
- Advertising campaign data/components were preserved. TypeScript and production build passed; all 24 partner assets have matching dimensions, eight selectors render, home/partner asset references resolve, and server markup of the seven unaffected routes matches the previous version. Native source/card crops were inspected. Browser interaction and viewport checks remain unavailable in this restricted sandbox.
# Custom product boards carousel — 2026-10-15

- Replaced the three generic product illustrations in the final `/products` carousel with 16 scenes from `files_for_site/Slides for sliders`, supplied after inspection of the Figma `Продукция` page and its `image` frame (`1523:3386`).
- Added 31 WebP assets under `public/assets/products/custom/` (about 3.6 MB total), preserving the original dimensions and alpha. Scene names and image pairs are recorded in `src/data/custom-boards.ts`.
- Use the supplied faded artwork for neighboring slides with no additional opacity. The café scene has no supplied faded partner, so its main artwork uses 50% opacity when displayed at the side. Removed the old figure captions so the supplied artwork occupies the full slide; accessible labels remain.
- Validation: TypeScript and production build; all 31 image files decoded successfully. Browser validation and desktop/mobile screenshots were unavailable: this environment denies the Vite listening socket and Chromium startup (`Operation not permitted`).

# RTV video integration — 2026-10-15

- `RTVPage.tsx` opens a native dialog with channel playlists and the supplied header clip. Channel cards keep hover/tap flips; the commercial CTA and player CTA open the existing «ФОРМА РТВ». Missing clips have no invented source and show «Скоро»; NEWS and ENTERTAINMENT remain empty.
- `RtvVideoDialog.tsx`, `rtv-media.ts`, `rtv-media.json`, and `rtv-video.css` add playback, next available clip, quality selection, inline mobile playback, error/retry, and cleanup on close. No videos are mounted until the viewer opens.
- Added resumable FFmpeg preparation, S3-compatible upload, local/remote media validation, encoding-profile tests, `.env.example`, and `RTV_VIDEO_SETUP.md`. The S3 uploader rejects uncompressed files. External-storage builds omit local video copies.
- Actual state: 12 original videos staged locally, 525,049,938 bytes. Compression could not run (`ffmpeg`/`ffprobe` absent; tool download blocked by DNS/network restrictions); Docker access denied. No storage endpoint, bucket, or credentials were supplied, so no cloud resources were created or uploaded. Missing: Поздравления, Батюшка, Юнихелл, Общий ролик GBC. Only one МЧС file was supplied.
- Validation: TypeScript and production build pass; all 12 MP4 containers and playlist order pass; three encoding-profile tests pass; scripts parse successfully; rejection of uncompressed uploads verified. Actual transcoding, quality comparison, browser playback, and remote S3 playback remain unverified due to the stated environment constraints.

