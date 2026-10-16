# Releases Android automáticas — Tiny Wins

Decisão do titular em 16/10/2026, tarefa 034: automatizar assinatura e envio ao **teste interno**, sem aprovação manual a cada versão. Esta decisão sucede a preferência provisória por assinatura local; o backup no 1Password continua. Publicação em produção não faz parte deste fluxo.

## Estado atual

- Código do fluxo preparado localmente; publicação do workflow no GitHub e execução real ainda precisam ser registradas na tarefa 034.
- GitHub já tem os ambientes android-signing e android-publish, limitados às referências permitidas, sem revisores obrigatórios e sem bypass das regras de ambiente.
- Regras ativas: somente administradores atualizam main e criam tags android-v*; tags de release não podem ser reescritas ou apagadas. Hoje o único colaborador administrador é o titular.
- As quatro credenciais de upload foram copiadas do documento verificado no cofre Private do 1Password para Secrets do ambiente android-signing, após autorização explícita do titular. A presença dos quatro nomes foi conferida sem exibir valores. Nada é gravado como arquivo no Git; credenciais não entram no artefato. O certificado público também foi configurado como variável e PLAY_INTERNAL_ENABLED permanece false.
- Google Cloud configurado no projeto tiny-wins-511823 (número 295413158727): conta tiny-wins-play e provedor OIDC android-release no pool tiny-wins-github. Restrições de proprietário/repositório/workflow/tag/ambiente conferidas no Google; dois identificadores públicos registrados e conferidos em android-publish no GitHub. Nenhuma chave permanente de conta de serviço existe. A autenticação real de uma Action ainda precisa ser exercitada.
- Conta Play: identidade/telefone e primeiro app ainda pendentes. Publicação automática deve continuar desativada até concluir esses passos, o primeiro envio e a instalação/atualização piloto.

## Fluxo após a configuração inicial

Criar uma tag como android-v0.1.0-beta.1 em um commit da main. A versão base deve corresponder a expo.version em app.json; são aceitos os sufixos beta.N e rc.N. A criação da tag é a decisão normal de lançar uma versão; não há outro clique de aprovação de credenciais por execução.

1. **Verificar**, sem segredos: confirmar repositório/evento/tag e que o commit pertence ao histórico da main; executar verify, inspeção de bundle e política de segurança existente.
2. **Compilar e assinar** em runner temporário: só depois dos gates, acessar a chave de upload via ambiente android-signing. Conferir o certificado e o bundle incorporado. Guardar AAB/metadados públicos em artefato com retenção de sete dias; apagar arquivos temporários da chave.
3. **Publicar** em outro runner: baixar o artefato específico da compilação, obter um token Google de dez minutos via OIDC e conferir revisão/hash/versão antes do envio. Alterar somente a faixa internal. Não repetir commits em erro nem tentar produção como alternativa.

Os códigos de versão automáticos são 100000 + GITHUB_RUN_NUMBER deste workflow. Reservar essa faixa e não reiniciar o contador/renomear o workflow ou enviar versões manuais maiores sem planejar a continuidade. A API recusa códigos menores/iguais aos ativos; colisões históricas também são recusadas pelo Google. Reexecução pode exigir uma nova tag; não recriar uma tag existente.

Play App Signing guarda a chave que assina os APKs entregues. O GitHub usa apenas a chave de upload, com backup no 1Password. A autenticação OIDC para publicar não substitui essa chave de assinatura: evita uma segunda credencial permanente de acesso à conta Google. [Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756) · [Autenticação oficial Google/GitHub](https://github.com/google-github-actions/auth).

## Configuração inicial do Google

O projeto organiza a identidade e o acesso à API; a proposta não contrata servidor, banco, armazenamento de segredos ou compilação no Google Cloud. A API IAM é gratuita. O script não associa faturamento nem cria recursos pagos; se o cadastro exigir faturamento/termos novos, o titular deve revisar antes. A taxa da Play Console é separada. [Preços IAM](https://cloud.google.com/iam/pricing).

Com um projeto escolhido/criado pelo titular e gcloud autenticado (pode ser o Cloud Shell), revisar e executar:

```sh
export TW_GOOGLE_PROJECT_ID='ID_REAL_DO_PROJETO'
export TW_CONFIRM_GOOGLE_SETUP=yes
bash scripts/configure-play-oidc.sh
```

Esse script habilita IAM/credenciais/STS/Android Publisher, cria identidade e pool/provedor dedicados e restringe a confiança pelos IDs imutáveis do repositório e proprietário, caminho do workflow, tag de release e ambiente android-publish. Concede somente impersonação dessa identidade; não cria uma chave JSON nem dá acesso de administrador ao projeto.

Guardar as duas saídas públicas como variáveis do ambiente android-publish no GitHub:

- GOOGLE_WORKLOAD_IDENTITY_PROVIDER
- GOOGLE_PLAY_SERVICE_ACCOUNT

Na Play Console, depois que o primeiro app existir, conceder à conta de serviço **somente acesso ao Tiny Wins**, leitura necessária dos dados do app e permissão de enviar/liberar versões nas faixas de teste. Não conceder administração, finanças, gerenciamento de usuários ou produção. A identidade não pode contornar a verificação da conta ou o primeiro cadastro. [Configuração oficial da API](https://developers.google.com/android-publisher/getting_started).

## Ativação única

Após registrar o pacote, configurar Play App Signing, fazer o primeiro envio e comprovar instalação/atualização preservando dados em um piloto, definir a variável de repositório PLAY_INTERNAL_ENABLED=true. Antes disso ela fica false e o workflow gera apenas o candidato, com publicação explicitamente ignorada.

O workflow manual android-candidate continua disponível apenas na main, com o mesmo ambiente de assinatura. Não envia à loja.

## Limites e recuperação

Um repositório público não torna Secrets públicos. Ainda assim, código malicioso executado com uma credencial pode extraí-la. As restrições reduzem quais códigos podem chegar às credenciais; não protegem contra comprometimento da conta administradora ou alterações deliberadas das regras. Proteger a conta do titular e revisar mudanças dos workflows permanece necessário. A ausência de aprovação por release é uma decisão de confiança nesse caminho restrito. [Ambientes e referências permitidas](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).

Se falhar, não enfraquecer gates nem apagar dados do app. Conferir a execução e a Play Console antes de repetir um envio, especialmente se o resultado do commit estiver incerto. O publicador limpa apenas a própria edição não confirmada. Em caso de suspeita de vazamento, desativar PLAY_INTERNAL_ENABLED, revogar a confiança OIDC e solicitar troca da chave de upload; recuperar a cópia correta no 1Password. Nunca colocar credenciais em issues, logs ou relatórios.

A automação continua sujeita às validações/processamento da loja e à validade da política de segurança do projeto. Não há promessa de publicação instantânea ou de gates sempre aprovados. A primeira execução real e a autenticação Google ainda precisam de evidência, além dos testes locais do publicador.

## Diagnóstico de autenticação sem publicação

A execução manual do mesmo workflow aceita somente uma tag dedicada `android-voidc-check-*`, apontando para um commit da main. Essas tags são excluídas do gatilho automático de release e continuam sujeitas às mesmas regras imutáveis e condições Google para `android-v*`. O job `auth-check` usa somente android-publish, confirma a origem na main e obtém um token de dez minutos com a mesma configuração de autenticação da publicação. Não recebe secrets de assinatura, não compila, não cria artefatos e não chama a API Play. O token é apenas verificado como não vazio, sem ser impresso. Em execução manual, os jobs de release permanecem ignorados. PLAY_INTERNAL_ENABLED continua false; sucesso deste diagnóstico não comprova permissões Play ou instalação/atualização.
