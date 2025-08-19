import fs from 'fs';
import path from 'path';

function generateSiteMap(cities) {
  const baseUrl = 'https://cidades.cirgrafica.com.br';
  
  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    }
  ];

  // URLs de estados
  const estados = [...new Set(cities.map(city => city.estado))];
  const estadoUrls = estados.map(estado => ({
    url: `${baseUrl}/grafica/estado/${estado}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.8'
  }));

  // URLs de cidades
  const cidadeUrls = cities.map(city => ({
    url: `${baseUrl}/grafica/${city.estado}/${city.cidade}`,
    lastmod: new Date().toISOString(),
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
    // Lê o arquivo cidades.json
    const cidadesPath = path.join(process.cwd(), 'cidades.json');
    const cidadesData = fs.readFileSync(cidadesPath, 'utf8');
    const cities = JSON.parse(cidadesData);
    
    const sitemap = generateSiteMap(cities);

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
