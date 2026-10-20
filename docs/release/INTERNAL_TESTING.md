# Tiny Wins — como convidar amigos para o teste interno

Preparação em 20/10/2026, [tarefa 038](../../.harness/tasks/038-first-play-internal-release.md).

## Situação da primeira versão

O candidato original **0.1.0 (1)**, pacote `app.tinywins.mobile`, foi substituído antes do envio: a revalidação encontrou sobreposição da barra inferior no Android com três botões. A [tarefa 039](../../.harness/tasks/039-android-tab-safe-area.md) corrige essa altura, e a [tarefa 040](../../.harness/tasks/040-android-system-navigation-contrast.md) acrescenta o módulo oficial autorizado para manter os botões do sistema legíveis nos dois temas.

A versão **0.1.0 (100006)** foi publicada no **teste interno** em **20/10/2026 às 20h21 (Brasília)**. A Console confirma **Ativo** e **Disponível para testadores internos**. Fonte `464331b`, tag `android-v0.1.0-beta.5`, [compilação assinada aprovada](https://github.com/squiter/tiny-wins/actions/runs/39510936963). As versões intermediárias foram substituídas antes da distribuição.

**[Participar do teste interno](https://play.google.com/apps/internaltest/4701397993886033581)** — endereço confirmado no botão habilitado da própria Console após a publicação.

A lista **Primeiros testadores**, com as cinco contas fornecidas pelo titular, está salva e selecionada somente nesta faixa. Os e-mails permanecem na Console. O modelo continua **App / Pago / Português (Brasil)**. Até a configuração e revisão da loja, o download pode mostrar o nome temporário **app.tinywins.mobile (unreviewed)**. A publicação pode levar uma hora ou mais para se propagar.

Validação: `npm run verify` aprovado (175 testes, tipos, lint, formatação e exportações); arquivo assinado, procedência, bibliotecas nativas e inspeção de credenciais aprovados. Seis jornadas finais offline em Android 10 aprovadas; atualização preserva dados; calendário mantém 14 células iguais e barras/controles passam com texto normal e 150%. Backup exportação/restauração aprovados. A revisão visual após reinício limpo do emulador confirma contraste nos dois temas, teclado e reinício do app. Não houve instalação por um aparelho físico ou pela entrega real da Play; esse é o próximo teste com um amigo.

O modelo pago preserva a possibilidade de cobrar no lançamento. Os convidados do **teste interno** podem instalar gratuitamente; esse teste não coloca o app à venda em produção. Há limite de 100 testadores. [Ajuda oficial do Google](https://support.google.com/googleplay/android-developer/answer/9845334?hl=pt-BR)

## Preparar o convite na Console

1. Abrir Tiny Wins → **Testar e lançar → Testes → Teste interno → Testadores**. Os nomes das opções podem variar com o idioma da Console.
2. Criar uma lista de e-mails e adicionar as contas Google que os amigos usam na Play Store. Salvar a lista e selecioná-la para essa faixa. Manter os endereços na Console; não incluí-los no repositório público.
3. Na aba de versões, confirmar que a versão foi efetivamente disponibilizada no teste interno, resolvendo os erros apresentados pela Console. Um rascunho ou um AAB apenas enviado ainda não é uma versão disponível.
4. Copiar o **link de participação no teste** exibido pela própria Console. A primeira publicação e o primeiro link podem levar algumas horas para funcionar. Não adivinhar o endereço nem usar um link de compartilhamento interno de apps.
5. Antes de convidar todo o grupo, instalar pela Play em um aparelho piloto e verificar abertura offline, hábitos, notas e backup. A entrega real da Play continua separada da validação em emulador.

## O que cada amigo precisa fazer

1. Passar ao responsável o e-mail da conta Google usada na Play Store do celular Android.
2. Depois de ser incluído na lista, abrir o link de participação com **essa mesma conta** e aceitar participar do teste.
3. Seguir o link para a Google Play e instalar. O app em teste interno não precisa aparecer na busca pública. Se aparecer “não disponível”, conferir a conta selecionada, a lista de testadores e o processamento da versão.
4. Usar normalmente e relatar os problemas ao responsável. Para um erro visual, informar o modelo do celular, a versão do Android e enviar uma captura sem dados privados.
5. Atualizar pela Play Store, sem desinstalar. Hábitos, vitórias e notas ficam no aparelho; exportar um backup em Ajustes antes de trocar de celular ou limpar dados. Uma atualização deve preservar esses dados e precisa de aceitação própria na entrega pela Play.

## Próxima etapa depois do teste interno

O teste interno permite validar rapidamente com os amigos, mas não cumpre sozinho o requisito de produção para contas pessoais novas. O Google exige teste **fechado** com pelo menos **12 testadores inscritos continuamente durante 14 dias**, seguido da solicitação de acesso à produção. [Requisitos oficiais](https://support.google.com/googleplay/android-developer/answer/14151465?hl=pt-BR)

Não enviar convites nem publicar uma versão pública como consequência automática deste guia.
