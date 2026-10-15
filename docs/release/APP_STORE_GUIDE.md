# Tiny Wins — primeira publicação na App Store

Guia conferido em **14 de outubro de 2026**. Nome confirmado: **Tiny Wins**. Modelo confirmado: **compra única para baixar**, sem assinatura nem compras dentro do app. Você ainda não tem inscrição Apple Developer. O app está em preparação; ainda não está pronto para submissão.

Use este guia junto com a [lista de liberação](READINESS.md). Enquanto a inscrição está com o suporte, a ordem aprovada é sugestões editáveis, metas semanais flexíveis e timer de sessão; widgets, sons e integrações continuam para etapas futuras. A tarefa 017 entrega inglês e português do Brasil, com dez cenários aprovados no iPhone simulado (38785809828). Isso não substitui os testes do candidato assinado nem a revisão dos idiomas e das telas da loja antes da publicação.

## 1. Entenda as três etapas

| Etapa                   | O que significa                                                               |
| ----------------------- | ----------------------------------------------------------------------------- |
| Apple Developer Program | Sua inscrição anual para distribuir apps assinados.                           |
| TestFlight              | Instalar a versão de produção no seu iPhone e distribuí-la para testes.       |
| App Store               | Enviar o app para avaliação da Apple e, depois da aprovação, liberar a venda. |

Os arquivos atuais do GitHub são builds de desenvolvimento para simulador e Android debug. Não são o arquivo de produção assinado necessário para a loja. Enviar um build ao TestFlight também não publica o app para venda. [Distribuição com Expo](https://docs.expo.dev/submit/ios/).

## 2. Faça sua inscrição na Apple

Abra [Apple Developer Program](https://developer.apple.com/programs/enroll/) e escolha inscrição individual ou organização. Ative a autenticação de dois fatores da sua Apple Account.

- **Individual:** a Apple mostra seu nome civil como vendedor. É uma decisão importante se você prefere publicar sob uma marca empresarial.
- **Organização:** exige uma entidade jurídica elegível, autoridade para representá-la e, normalmente, D‑U‑N‑S, além dos dados e site da organização.

A anuidade informada pela Apple é **US$ 99**, com valor local apresentado durante a inscrição. A assinatura dos termos, a identificação e o pagamento ficam com você. Não envie documentos, senhas ou dados bancários para este repositório. Espere a inscrição ser aprovada antes de configurar a distribuição. [Requisitos oficiais](https://developer.apple.com/programs/enroll/).

## 3. Habilite a venda do app

Depois da aprovação, entre em [App Store Connect](https://appstoreconnect.apple.com/). O titular da conta acessa **Business → Agreements** e aceita o **Paid Apps Agreement**. Complete os dados fiscais e bancários pedidos e confirme que o acordo está ativo. Você lê e aceita os termos pessoalmente. [Guia da Apple](https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements/).

Escolha o preço e os países de venda com base nas opções apresentadas no painel. Não crie um produto de compra dentro do app: o pagamento do Tiny Wins acontece no download pela loja. Preço, conta individual/organização e licença do código ainda não foram definidos.

## 4. Reserve a identidade e crie o cadastro

Antes de criar o cadastro, confirme o identificador definitivo. Hoje o projeto usa `app.tinywins.mobile`, mas ainda não verificamos sua disponibilidade na sua equipe Apple. O identificador acompanha assinatura e atualizações; não o trate como um campo provisório depois de publicar.

Registre um App ID explícito no portal Apple Developer e, em App Store Connect, abra **Apps → + → New App**. Informe plataforma iOS, nome Tiny Wins, idioma principal English (ou Português (Brasil), conforme a ficha escolhida), o Bundle ID registrado e um SKU interno, por exemplo `tiny-wins-ios`. O SKU não é o nome exibido ao comprador. Confirme a disponibilidade do nome; a autorização do nome neste projeto não garante disponibilidade na loja. [Criar o cadastro](https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app).

Registre o Apple ID numérico do cadastro, a equipe escolhida e o identificador no registro de lançamento; credenciais ficam fora do Git. Revise também onde o app será disponibilizado, incluindo Mac/Vision Pro quando oferecidos pelo painel. Não habilite suporte anunciado sem testá-lo. [Submissão e disponibilidade](https://developer.apple.com/app-store/submitting/).

## 5. Feche os problemas de lançamento

Veja [READINESS.md](READINESS.md) para os resultados reais. Os próximos trabalhos são:

1. Acompanhar a segurança: o scanner bruto ainda registra 18 alertas altos de duas dependências de ferramentas. A política temporária aprovada na ADR-020 exige mitigações verificadas, testes e validade até 2026-10-22T00:00:00Z. Essas bibliotecas não aparecem no bundle iOS inspecionado; revisar novamente o pacote final assinado antes de enviar. Não usar `npm audit fix --force`: a sugestão atual volta para Expo 44 e quebra a base escolhida.
2. Criar e configurar um ícone próprio; revisar abertura, versão, número de build e identidade final.
3. Corrigir e testar a configuração de aparência: A configuração agora permite aparência automática (task 020); precisamos confirmar o acompanhamento real do sistema e os overrides salvos no binário final. [Configuração Expo](https://docs.expo.dev/develop/user-interface/color-themes/).
4. Testar exportação, cancelamento do seletor, restauração e preservação de histórico no iPhone. Conferir VoiceOver, movimento reduzido, reinstalação com restauração e atualização sem perda de dados.
5. Testar iPad: `supportsTablet` está ativo. Precisamos de layout e capturas próprios, ou decidir explicitamente limitar o primeiro lançamento a iPhone antes de gerar o binário.

Novas features não corrigem esses bloqueios. O resultado de simulador com seis fluxos aprovados é útil, mas não substitui essa validação de produção.

## 6. Gere o build de produção

**Rota proposta: EAS Build/Submit**, serviços do Expo. Permite compilar na nuvem sem depender de Xcode local. A alternativa é compilar e assinar com Xcode. Ainda não existe `eas.json` nem vínculo com um projeto EAS; vamos configurar depois de confirmar equipe/identidade e revisar custos e tratamento de credenciais.

Nesta etapa, criamos um perfil `production`, com distribuição de loja, identificador final e incremento de build. Depois de configurar o projeto e entrar na conta Expo, os comandos são:

```sh
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

O primeiro gera um `.ipa` assinado; o segundo envia o build escolhido ao App Store Connect. Confira o identificador do build antes de enviar. O upload chega ao TestFlight após processamento e é separado da avaliação/publicação. Não configure envio automático nesta primeira rodada. [Procedimento oficial Expo](https://docs.expo.dev/submit/ios/).

A compilação precisa usar um SDK aceito pela Apple na data do upload. Reconfira os requisitos vigentes; a página consultada já anuncia requisitos adicionais para abril de 2027, que não devem ser confundidos com os requisitos atuais. [Requisitos de submissão](https://developer.apple.com/app-store/submitting/).

## 7. Teste pelo TestFlight

Instale o TestFlight no iPhone, distribua primeiro para o grupo interno elegível e instale o build enviado. Testadores externos podem exigir avaliação beta. Use a versão sem servidor de desenvolvimento, inclusive em modo avião. [TestFlight](https://developer.apple.com/testflight/).

Use hábitos fictícios para testar: criar, completar, fechar/reabrir, alterar frequência, tolerância, nota, desfazer uma data, arquivar/restaurar, mudar tema e exportar/restaurar um backup. Anote aparelho, iOS, versão/build e resultado. Teste atualização sobre um build anterior; não desinstale para simular atualização. Para reinstalação, exporte antes e restaure depois: não há sincronização própria do app.

## 8. Prepare a página da loja

Use o [rascunho de textos](STORE_LISTING.md). Preencha descrição, subtítulo, palavras-chave, categoria, informações de contato da avaliação e questionário de classificação etária com base nas funções reais. Confira a informação de acessibilidade com evidência; não marque VoiceOver como validado só por existirem labels. [Preparação da página](https://developer.apple.com/app-store/submitting/).

Precisamos publicar uma página de suporte e uma política de privacidade com URLs públicas estáveis. Uma política é obrigatória mesmo para apps locais. A resposta proposta é “não coletamos dados”, condicionada à revisão do binário final e dos SDKs. A Apple diferencia processamento apenas no aparelho de coleta; exportar um backup explicitamente também precisa ser explicado ao usuário. Revise manifests de privacidade, APIs com motivo exigido e a pergunta de criptografia do build; não responda automaticamente só porque não temos login. [Política e formulário](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/), [definição de coleta](https://developer.apple.com/app-store/app-privacy-details/).

Capture a versão nativa final, com dados fictícios e dimensões aceitas para iPhone; prepare o conjunto de iPad se o suporte continuar ativo. As imagens do README, de 390 × 1250, são prévias web e **não são screenshots prontas para a loja**. A tabela oficial define os grupos de aparelhos e as resoluções aceitas; confira antes de produzir as artes. [Especificações](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/).

## 9. Envie para avaliação e publique

No cadastro da versão, selecione o build testado e complete os campos que o painel indicar. Use as notas de avaliação do rascunho para explicar armazenamento local, ausência de conta e compra única. Reconfirme preço, países, privacidade e classificação. Escolha **liberação manual após aprovação** para controlar o primeiro lançamento.

Envie para App Review quando a lista de liberação estiver concluída. Se houver uma pendência, leia a mensagem, responda com evidência e envie outro build quando necessário. Não existe garantia de prazo ou aprovação. Após aprovação, revise a página uma última vez e libere a versão manualmente no painel. [Fluxo oficial](https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow).

## O que você pode fazer agora

Comece pela inscrição, decidindo entre seu nome como pessoa física ou organização. Enquanto ela é processada, podemos fechar os testes, ícone, suporte/privacidade e configuração de produção. Não precisamos adicionar widgets ou integrações para lançar uma primeira versão útil.
