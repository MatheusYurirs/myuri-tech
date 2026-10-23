# M.Yuri Tech — Website

Site institucional estático da **M.Yuri Tech**, publicado via GitHub Pages na branch `main`.

- **Produção:** https://matheusyurirs.github.io/myuri-tech/
- **Candidata v2:** branch `feat/site-v2`.
- **Tecnologia:** HTML/CSS/JavaScript sem backend nem build obrigatório.
- **Contato:** Formspree + WhatsApp, com configurações públicas explícitas em `index.html`.

## Organização

| Caminho | Conteúdo |
|---|---|
| `index.html` | Landing page, estilos e scripts da experiência |
| `privacidade.html` | Aviso de privacidade |
| `tests/site-smoke.mjs` | Smoke tests estruturais e Chromium |
| `.github/workflows/site-qa.yml` | Integração contínua |
| `docs/RELEASE-v2.md` | Escopo, QA, riscos, publicação e rollback |
| `CHANGELOG.md` | Registro de mudanças |

## Desenvolvimento e QA

Não precisa instalar um framework ou migrar para React para manter o site.

```bash
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install chromium
python3 -m http.server 8765 --bind 127.0.0.1
# Em outro terminal
node tests/site-smoke.mjs
```

O teste do Formspree usa interceptação de rede e resposta simulada; não envia mensagem real.

## Regras de publicação

1. Trabalhar em branch `feat/*` ou `fix/*`.
2. Abrir PR para `main` com descrição, testes e screenshots.
3. Exigir QA verde; conferir responsividade, link de contato e Formspree.
4. Confirmar alterações de privacidade e SEO.
5. Fazer merge manual após revisão e validar a página publicada.

**Não publicar dados reais de clientes, pacientes, chaves de API ou segredos no repositório.**

## Marca e conteúdo

Preservar logotipo azul/turquesa e contraste tipográfico editorial (título sans + destaque serifado). A Vialena é apresentada somente como demonstração experimental. Não inventar clientes, depoimentos, números ou resultados.
