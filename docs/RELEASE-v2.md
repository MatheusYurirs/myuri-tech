# M.Yuri Tech — Release v2 (candidata)

## Objetivo
Evoluir a landing page estática sem perder a identidade original: composição editorial, serif itálica no lema *Sem complicar.*, logotipo azul/turquesa e comunicação clara para pequenos negócios.

## Escopo entregue
- Alternância claro/escuro respeitando preferência do sistema e escolha persistida no navegador.
- Modo escuro grafite com acentos turquesa e botões azuis; variantes da marca para contraste.
- Refinamento do cabeçalho responsivo, estabilidade de layout e cores da seção Sobre.
- Seção Projetos com Vialena como **demonstração experimental**, identificada como não clínica e não produtiva.
- Melhorias de responsividade, acessibilidade pontual, cores de estados do formulário e metadados de indexação.
- Testes automatizados de fumaça para navegadores desktop e mobile.

## Gestão de mudanças
- Branch: `feat/site-v2`.
- Destino: `main`.
- Não houve alteração da `main` nem publicação automática durante a preparação.
- Não há mudanças de backend, armazenamento de dados ou autenticação.

## Checklist antes do merge
- [ ] Workflow **Site v2 QA / browser-smoke** verde no HEAD do PR.
- [ ] Inspecionar capturas dos tamanhos 1440×900, 390×844 e 320×720.
- [ ] Revisar contraste e sobreposição no Firefox, Chrome e celular físico.
- [ ] Confirmar WhatsApp e e-mail de contato com o proprietário.
- [ ] Confirmar que a integração Formspree recebe mensagens reais em ambiente controlado (sem usar dados pessoais de terceiros).
- [ ] Verificar a política de privacidade, os metadados e a URL canônica no GitHub Pages.
- [ ] Fazer merge manual somente após revisão.

## Limitações e riscos aceitos
- Testes automatizados simulam a resposta HTTP do Formspree; **não comprovam entrega real de e-mail**.
- Não foram executadas auditorias externas WCAG completas nem testes de carga.
- A versão Vialena vinculada é uma demonstração e não representa produto clínico pronto.
- `index, follow` habilita elegibilidade de indexação após merge; não garante posicionamento nos mecanismos de busca.
- Revisão manual de design aprovada pelo proprietário para desktop e mobile; validação cross-browser ainda necessária.
- A política de privacidade permanece página separada.
- Sem prova social fictícia, clientes inventados ou resultados comerciais não verificáveis.

## Smoke test local
Requer Node.js 22+, Python 3 e navegador Chromium instalável.

```bash
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install chromium
python3 -m http.server 8765 --bind 127.0.0.1
# Em outro terminal
node tests/site-smoke.mjs
```

Os testes fazem `route.fulfill` na URL do Formspree, impedindo envio real pelo cenário automatizado. Os screenshots são gerados em `artifacts/qa/`.

## Rollback
Em caso de regressão após merge, restaurar o commit anterior da `main` ou reverter o commit de merge pelo GitHub e validar novo deployment. Não excluir o histórico.

## Critério de publicação
Não publicar apenas porque a implementação é visualmente agradável: exigir CI verde, conferência do formulário, revisão dos links e aprovação final do PR.
