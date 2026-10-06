# Publicar na Netlify

Importe o repositório `strikercslago/Rodrigo-Medeiros---Fisioterapia` e selecione a branch `main`.

- Base directory: vazia (raiz do repositório)
- Build command: `python3 scripts/configure_seo.py`
- Publish directory: `dist`

As opções já estão em `netlify.toml`. Não há dependências npm nem backend. A publicação serve HTML, CSS, JavaScript e imagens estáticas. Os formulários de contato usam WhatsApp, sem chaves de API.

O site pode ser publicado antes de definir domínio personalizado. Quando o endereço oficial estiver confirmado, defina `SITE_URL` na Netlify (URL HTTPS sem barra final) e faça novo deploy. O build criará canonical, sitemap e metadados sociais absolutos. Não use URL de deploy preview nessa variável. Alternativamente, configure `site_url` em `seo-config.json`.

Consulte `SEO.md` para os dados comerciais que ainda precisam de confirmação e para o Search Console. Não há canonical fictício nem bloqueio noindex na Home.

Após o deploy, conferir Home, navegação, imagens, WhatsApp, versão mobile e HTTPS. Se `SITE_URL` estiver configurada, conferir também `/sitemap.xml` e sua referência em `/robots.txt`.
