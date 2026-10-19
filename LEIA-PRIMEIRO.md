# M.Yuri Tech — formulário com feedback visual e envio por Formspree

## O que foi corrigido
- Agora o botão exibe **Enviando sua solicitação...** assim que você clica.
- Um painel imediatamente abaixo do botão mostra **aguardando**, **enviado** ou **erro**, sempre de forma visível.
- Avisos de validação aparecem imediatamente, e a mensagem deve conter ao menos 10 caracteres.
- Um limite de 12 segundos encerra a espera infinita pelo serviço remoto.
- Se houver falha, o formulário não mostra sucesso falso: recomenda o WhatsApp como alternativa.
- Se o JavaScript estiver totalmente desativado na versão HTML, o navegador pode usar o envio nativo direto ao Formspree, sujeito à confirmação externa.
- A versão React usa o mesmo feedback visual e timeout.

## Como testar
1. Abra MYuriTech-formulario-feedback.html e vá a Contato.
2. Preencha nome, e-mail, serviço e uma frase de mais de 10 caracteres.
3. Clique Enviar solicitação. Um painel azul de **Envio em andamento** deve aparecer imediatamente.
4. Se o Formspree confirmar, o painel fica verde com confirmação. Se der erro, fica vermelho e sugere WhatsApp.
5. Para confirmar **entrega real**, cheque a caixa e painel da conta Formspree e o e-mail destinatário. Não enviamos mensagem real durante os testes.

## Observações
- Algumas visualizações de arquivo/sandbox bloqueiam requisições externas. Para teste definitivo, publique o site em hospedagem HTTPS com domínio/autorização no Formspree.
- O ID público do formulário, o WhatsApp e o e-mail estão configurados segundo os dados fornecidos pelo proprietário.
- A versão HTML pode ser aberta sozinha. A versão React depende da instalação de suas dependências para build.
