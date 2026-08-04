// Pool de fotos reais de produção usadas como imagem de destaque nas páginas
// de cidade. Cada cidade recebe uma foto fixa (determinística, não sorteada a
// cada carregamento) escolhida a partir do nome da cidade + estado — assim a
// mesma cidade sempre mostra a mesma foto (bom pra cache e consistência de
// SEO), mas cidades diferentes ficam com fotos variadas em vez de repetir
// sempre a mesma imagem.
const CITY_HERO_IMAGES = Array.from(
  { length: 37 },
  (_, i) => `/conceituais/materiais-graficos-impressao${i + 1}.jpeg`
)

export function getCityHeroImage(cidade, estado) {
  const key = `${estado}-${cidade}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % CITY_HERO_IMAGES.length
  return CITY_HERO_IMAGES[index]
}
