# SEO e publicação

A Home contém title, description, idioma pt-BR, Open Graph básico, Twitter Card e JSON-LD Person/MedicalClinic com apenas dados conhecidos. Perguntas frequentes estão no HTML, sem depender de JavaScript. A imagem social é `dist/assets/social-card.jpg` (1200 × 630). Fotografias foram convertidas para WebP, sem alterar conteúdo. A Hero tem prioridade; galerias usam carregamento adiado, dimensões e imagens responsivas.

## Dados ainda necessários

Editar `seo-config.json` com o domínio HTTPS oficial (não preview), telefone confirmado, endereço completo, CEP, link direto oficial do Google Maps e perfis sociais confirmados. O telefone visível atual é provisório, conforme README. Ele foi omitido do schema até confirmação. Não foram inventados horários, coordenadas, registro profissional, notas ou certificados. O endereço parcial do schema não equivale à validação de elegibilidade para resultados locais enriquecidos.

## Gerar metadados de produção

Executar `python scripts/configure_seo.py --production` na pasta `site`. O comando exige domínio oficial; produz canonical absoluto, og:url, URLs absolutas das imagens sociais, sitemap.xml contendo somente a Home e referência ao sitemap em robots.txt. Sem domínio, o modo normal gera apenas os campos independentes dele. Não há sitemap fictício nem canonical apontando para localhost. Reexecutar o comando ao atualizar dados. O sitemap não contém lastmod artificial.

Confirmar que telefone, endereço e links visíveis em index.html coincidem com a configuração e o Perfil da Empresa antes da publicação. O link atual do Maps é uma busca nominal, não um link confirmado do perfil. A exportação `apresentacao.html` foi retirada de dist para não publicar uma Home duplicada.

## Após publicação

Verificar HTTP 200 na Home, robots e sitemap; HTTPS; redirecionamento permanente de variantes de domínio/HTTP para a versão canônica; cache e compressão no provedor. A Home não tem noindex. Confirmar que o servidor não adiciona X-Robots-Tag: noindex. Medir Core Web Vitals em produção; não há dados de campo nesta prévia.

Adicionar a propriedade real no Google Search Console, preferencialmente por DNS. Caso seja usada verificação HTML, inserir o token real em `search_console_token` e regerar. Enviar sitemap, inspecionar a Home e solicitar indexação. Validar JSON-LD no Rich Results Test e Schema Markup Validator. Isso não garante posição ou indexação.

Referências: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap e https://developers.google.com/search/docs/appearance/structured-data/local-business
