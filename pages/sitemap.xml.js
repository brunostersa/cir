import cidades from '../cidades.json';
import { normalizeText } from '../utils/normalize';

const BUILD_DATE = new Date().toISOString().slice(0, 10);

function generateSiteMap(cities) {
  const baseUrl = 'https://cidades.cirgrafica.com.br';

  // URLs estáticas
  const staticUrls = [
    { url: baseUrl, lastmod: BUILD_DATE, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/portfolio`, lastmod: BUILD_DATE, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/consultoria`, lastmod: BUILD_DATE, changefreq: 'monthly', priority: '0.7' },
  ];

  // URLs de estados
  const estados = [...new Set(cities.map(city => city.estado))];
  const estadoUrls = estados.map(estado => ({
    url: `${baseUrl}/grafica/estado/${estado.toLowerCase()}`,
    lastmod: BUILD_DATE,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  // URLs de cidades
  const cidadeUrls = cities.map(city => ({
    url: `${baseUrl}/grafica/${city.estado.toLowerCase()}/${normalizeText(city.cidade)}`,
    lastmod: BUILD_DATE,
    changefreq: 'monthly',
    priority: '0.6'
  }));

  const allUrls = [...staticUrls, ...estadoUrls, ...cidadeUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will handle the XML generation
}

export async function getServerSideProps({ res }) {
  try {
    const sitemap = generateSiteMap(cidades);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    res.statusCode = 500;
    res.end('Erro ao gerar sitemap');
  }

  return {
    props: {},
  };
}

export default SiteMap;
