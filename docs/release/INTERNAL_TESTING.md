# Tiny Wins — como convidar amigos para o teste interno

Preparação em 20/10/2026, [tarefa 038](../../.harness/tasks/038-first-play-internal-release.md).

## Situação da primeira versão

O candidato original **0.1.0 (1)**, pacote `app.tinywins.mobile`, foi substituído antes do envio: a revalidação encontrou uma sobreposição da barra inferior no Android com três botões. A [tarefa 039](../../.harness/tasks/039-android-tab-safe-area.md) prepara e valida o pacote corrigido, tag `android-v0.1.0-beta.2`, revisão `c9e1ef2` (mesmo código do app da correção `2563e3d`). A compilação assinada está em [Actions](https://github.com/squiter/tiny-wins/actions/runs/39495461832). A tentativa anterior compilou e assinou, mas falhou na conferência final por uma ferramenta ausente no servidor; a tarefa 041 mantém a mesma conferência usando uma ferramenta padrão. O pacote desta nova execução ainda precisa ser baixado e aceito no emulador. O contraste dos botões do sistema no Android 10 está na [proposta 040](../../.harness/tasks/040-android-system-navigation-contrast.md), aguardando autorização para o módulo oficial. A conta já permite cadastrar o aplicativo e a Console confirmou a disponibilidade do pacote. O formulário foi preparado como **App**, **Pago**, idioma padrão **Português (Brasil)**. O cadastro e o envio ainda dependem do pacote corrigido e das declarações legais do titular; não existe link de adesão confirmado.

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
