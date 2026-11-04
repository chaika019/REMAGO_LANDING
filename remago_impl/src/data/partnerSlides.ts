// Full central and side cards from folder 4 / Pasted image.png.
export const partnerSlides = [
  { file: 'sosedi', name: 'Соседи' },
  { file: 'geely', name: 'Geely' },
  { file: 'nescafe', name: 'Nescafé' },
  { file: 'employment', name: 'Служба занятости' },
  { file: 'dabrabyt', name: 'Банк Дабрабыт' },
  { file: 'mtbank', name: 'МТБанк' },
  { file: 'tri-ceny', name: 'Три цены' },
  { file: 'ceramom-top', name: 'КерамОмТорг' },
].map(({ file, name }) => ({
  name,
  image: `/assets/partners/slides/${file}-center.webp`,
  leftImage: `/assets/partners/slides/${file}-left.webp`,
  rightImage: `/assets/partners/slides/${file}-right.webp`,
}))
