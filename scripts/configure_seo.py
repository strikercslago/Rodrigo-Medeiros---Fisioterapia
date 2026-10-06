"""Generate static metadata. Production requires a confirmed official HTTPS domain."""
from pathlib import Path
from urllib.parse import urlparse
from html import escape
import json, re, sys, os
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
config = json.loads((ROOT / 'seo-config.json').read_text(encoding='utf-8'))
base = (os.environ.get('SITE_URL') or config.get('site_url') or '').rstrip('/')
if base:
    parsed = urlparse(base)
    assert parsed.scheme == 'https' and parsed.hostname and '.' in parsed.hostname
    assert not parsed.query and not parsed.fragment and parsed.path in ('', '/')
    assert parsed.hostname not in ('localhost', '127.0.0.1', 'example.com')
if '--production' in sys.argv and not base:
    sys.exit('Configure site_url com o domínio oficial antes de preparar produção.')

title = 'Dr. Rodrigo Medeiros | Fisioterapia e Osteopatia em Passo Fundo'
description = 'Fisioterapia e Osteopatia em Passo Fundo. Cuidado individualizado para dor, equilíbrio e movimento. Conheça a clínica e agende sua avaliação.'
person = {'@type': 'Person', 'name': 'Rodrigo Medeiros', 'jobTitle': 'Fisioterapeuta e Osteopata'}
clinic = {'@type': 'MedicalClinic', 'name': 'Clínica Dr. Rodrigo Medeiros',
          'address': {'@type': 'PostalAddress', 'addressLocality': 'Passo Fundo', 'addressRegion': 'RS', 'addressCountry': 'BR'}}
if config.get('telephone'): clinic['telephone'] = config['telephone']
if config.get('street_address'): clinic['address']['streetAddress'] = config['street_address']
if config.get('postal_code'): clinic['address']['postalCode'] = config['postal_code']
if config.get('maps_url'): clinic['hasMap'] = config['maps_url']
if config['person_same_as']: person['sameAs'] = config['person_same_as']
if config['clinic_same_as']: clinic['sameAs'] = config['clinic_same_as']
tags = [f'<meta property="og:title" content="{escape(title)}">',
        f'<meta property="og:description" content="{escape(description)}">',
        '<meta property="og:type" content="website">', '<meta property="og:locale" content="pt_BR">',
        '<meta property="og:site_name" content="Clínica Dr. Rodrigo Medeiros">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{escape(title)}">',
        f'<meta name="twitter:description" content="{escape(description)}">']
if base:
    url = base + '/'
    tags += [f'<link rel="canonical" href="{escape(url)}">', f'<meta property="og:url" content="{escape(url)}">',
             f'<meta property="og:image" content="{escape(base)}/assets/social-card.jpg">',
             '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
             '<meta property="og:image:alt" content="Dr. Rodrigo Medeiros — Fisioterapia e Osteopatia em Passo Fundo">',
             f'<meta name="twitter:image" content="{escape(base)}/assets/social-card.jpg">',
             '<meta name="twitter:image:alt" content="Dr. Rodrigo Medeiros — Fisioterapia e Osteopatia em Passo Fundo">']
    person.update({'@id': url+'#profissional', 'url': url+'#rodrigo', 'image': base+'/assets/rodrigo-perfil.png'})
    clinic.update({'@id': url+'#clinica', 'url': url, 'image': base+'/assets/contato-fachada-jardim.png'})
    person['worksFor'] = {'@id': clinic['@id']}
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    sitemap = ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
    entry = ET.SubElement(sitemap, 'url'); ET.SubElement(entry, 'loc').text = url
    ET.ElementTree(sitemap).write(DIST/'sitemap.xml', encoding='utf-8', xml_declaration=True)
else:
    tags.append('<!-- Canonical, og:url, social image URLs and sitemap await the official domain. -->')
if config.get('search_console_token'):
    tags.append(f'<meta name="google-site-verification" content="{escape(config["search_console_token"])}">')
tags.append('<script type="application/ld+json">'+json.dumps({'@context':'https://schema.org','@graph':[person,clinic]},ensure_ascii=False).replace('</','<\\/')+'</script>')
html = (DIST/'index.html').read_text(encoding='utf-8')
html = re.sub(r'<title>.*?</title>', '<title>'+title+'</title>', html)
html = re.sub(r'<meta name="description"[^>]*>', '<meta name="description" content="'+description+'">', html)
html = re.sub(r'\n?<!-- SEO START -->.*?<!-- SEO END -->', '', html, flags=re.S)
html = html.replace('</head>', '\n<!-- SEO START -->\n'+'\n'.join(tags)+'\n<!-- SEO END -->\n</head>')
(DIST/'index.html').write_text(html, encoding='utf-8')
(DIST/'robots.txt').write_text('User-agent: *\nAllow: /\n'+('Sitemap: '+base+'/sitemap.xml\n' if base else '# Sitemap será adicionado após confirmação do domínio oficial.\n'), encoding='utf-8')
print('SEO estático atualizado.' if base else 'SEO parcial atualizado; domínio oficial pendente. Nenhuma URL inventada.')
