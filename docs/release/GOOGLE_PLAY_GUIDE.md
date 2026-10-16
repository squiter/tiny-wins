# Tiny Wins — testes oficiais pela Google Play

Preparação em 16/10/2026, tarefa 030. **Ainda não há conta criada, versão enviada ou link de instalação.** O app continua com as pendências de qualidade/segurança/assinatura registradas em [READINESS.md](READINESS.md) e na validação Android. A revisão visual 029 segue no chat principal.

## Caminho escolhido

Usaremos a faixa **Teste interno** da Google Play: até 100 testadores convidados instalam e atualizam pela loja. O app em teste não aparece na busca pública; cada amigo acessa o link de adesão usando a conta Google convidada. Os testadores internos podem instalar gratuitamente mesmo se a futura versão for paga. O primeiro link pode demorar algumas horas; não prometer disponibilidade imediata. [Google: faixas de teste](https://support.google.com/googleplay/android-developer/answer/9845334?hl=pt-BR)

A conta gratuita limitada do Android Developer Console não é o caminho escolhido: o guia a descreve para projetos sem intenção comercial, com autorização de até 20 dispositivos. Ela também não equivale à loja Play. [Guia da distribuição limitada](https://developer.android.com/developer-verification/guides/limited-distribution)

Não confundir **Teste interno** com **Compartilhamento interno de apps**: este último usa outro certificado de teste e exige ativação adicional no celular. Para continuidade até a versão final, usaremos a faixa de teste normal. [Google: compartilhamento interno](https://support.google.com/googleplay/android-developer/answer/9844679?hl=pt-BR)

## Parte do titular da conta

1. Abrir [Google Play Console](https://play.google.com/console/signup) com a conta que ficará responsável pelo app. Escolher conta pessoal ou organização conforme a situação real; não criar organização fictícia.
2. Ler/aceitar os termos, pagar a taxa única de US$25 e concluir as verificações solicitadas. Esses atos são do titular; não enviar documentos, cartão, senhas ou códigos de acesso neste chat. [Cadastro oficial](https://support.google.com/googleplay/android-developer/answer/6112435?hl=pt-BR)
3. Se a nova conta pessoal exigir verificação de aparelho, usar um Android físico não modificado, Android 10 ou posterior, no app Play Console, entrando como titular. Como você informou que não tem Android, será necessário combinar acesso temporário a um aparelho de confiança; o emulador não substitui esta etapa. Não precisa manter o mesmo aparelho depois. [Verificação de dispositivo](https://support.google.com/googleplay/android-developer/answer/14316361?hl=pt-BR)
4. Criar a ficha do Tiny Wins e confirmar o identificador definitivo. O código usa provisoriamente `app.tinywins.mobile`; disponibilidade/registro ainda não foram confirmados. Não criar um identificador separado com `.demo` se queremos atualização direta.

## Preparação técnica já incluída

O workflow manual `.github/workflows/android-candidate.yml` gera um **AAB de release** com JavaScript/recursos incorporados, pela infraestrutura já usada no projeto. Não precisa de conta Expo/EAS adicional. Ele não publica na Play, não cria convites e não dispara por push/PR.

Antes de executá-lo, as alterações precisam estar revisadas no GitHub. Configurar privadamente estes secrets do repositório:

| Secret                         | Conteúdo                             |
| ------------------------------ | ------------------------------------ |
| ANDROID_UPLOAD_KEYSTORE_BASE64 | Arquivo da chave de upload em Base64 |
| ANDROID_UPLOAD_STORE_PASSWORD  | Senha do arquivo                     |
| ANDROID_UPLOAD_KEY_ALIAS       | Nome da entrada da chave de upload   |
| ANDROID_UPLOAD_KEY_PASSWORD    | Senha da entrada                     |

Configurar também a variável `ANDROID_UPLOAD_CERT_SHA256` com o SHA-256 público do certificado dessa chave. Não há credenciais configuradas ou chaves permanentes geradas por esta tarefa. A chave de upload deve ser criada em ambiente privado, com `keytool` ou Android Studio, e ter cópia de segurança em cofre seguro antes do primeiro uso; nunca usar a chave debug nem colar as senhas em comandos/chat. Arquivos de chave e `.credentials/` estão ignorados pelo Git. [Assinatura no Google Play](https://support.google.com/googleplay/android-developer/answer/9842756?hl=pt-BR)

Em Actions → Android Google Play candidate → Run workflow, selecionar a revisão aprovada, informar o pacote confirmado e um `version_code` inteiro maior que todos os envios anteriores. Consultar o histórico da Play: o workflow não tem acesso à conta para descobrir o próximo número. Ele executa verificação e política de segurança existentes, gera o projeto nativo temporário, aplica assinatura de upload sem gravar senhas no Gradle, compila e verifica o certificado do AAB e a presença do bundle. Sem credenciais/certificado correto, falha sem substituir por assinatura debug.

O artefato `tiny-wins-google-play-candidate` contém AAB e metadados públicos (revisão, versão, certificado de upload e hash), retidos por sete dias. Ele ainda não é uma versão liberada para amigos. Preservar a política de segurança vigente, inclusive seu vencimento: não contornar uma falha para liberar o beta.

## Primeira disponibilização

Quando a versão passar os gates do projeto:

1. No app da Play Console, abrir Testar e lançar → Testes → Teste interno. Configurar a lista privada de e-mails Google dos testadores; não versionar essa lista.
2. Criar uma versão, enviar o AAB e ativar **Play App Signing**. Usaremos a assinatura de app gerenciada pelo Google desde o primeiro teste; a chave local é somente para upload. Revisar os avisos e dados solicitados pela Console.
3. Antes do grupo todo, instalar o app entregue pela Play em um aparelho piloto. Comprovar abertura sem servidor/Expo Go, funcionamento offline, notas, backups e persistência. Enviar uma versão posterior e confirmar que a atualização preserva hábitos, vitórias, notas e preferências sem desinstalar.
4. Concluir a liberação do teste e copiar o link real de adesão. Enviar o link aos amigos somente após aprovação do titular; nenhum link foi criado nesta tarefa.

Mensagem sugerida para os amigos, após existir o link: “Abra o convite usando a conta Google que você me passou, participe do teste e toque em instalar na Google Play. Para atualizar, use a loja sem desinstalar o app. Seus hábitos ficam neste celular; faça um backup em Ajustes se precisar trocar de aparelho. Me conte se alguma tela ficou cortada ou se encontrou um erro.” Substituir o convite pelo link real antes de enviar.

## Continuidade até a versão final

Manter o mesmo pacote e a assinatura gerenciada pela Play nas faixas interna, fechada e produção, sempre com versão compatível e migrações que preservem o banco. Uma atualização mantém o armazenamento local; desinstalar/limpar dados pode apagá-lo. Não distribuir o APK debug atual nem um APK assinado apenas com a chave de upload como se fossem a versão assinada pelo Google. [Como as atualizações funcionam](https://developer.android.com/google/play/app-updates)

Teste interno não substitui a exigência para publicação pública de novas contas pessoais: atualmente, teste **fechado** com pelo menos 12 testadores inscritos continuamente por 14 dias, seguido da solicitação de acesso à produção. Preço Android e eventuais benefícios dos amigos no lançamento ainda serão decididos; preservar dados e conceder acesso a uma versão paga são assuntos distintos. [Requisitos para produção](https://support.google.com/googleplay/android-developer/answer/14151465?hl=pt-BR)

## O que falta

Conta/verificações do titular; registro do pacote; chave de upload com backup e secrets configurados; workflow revisado/disponível no GitHub; primeira compilação AAB assinada; envio e assinatura pela Play; aceitação offline/atualização no aparelho piloto; gate de segurança vigente; revisão final e liberação do titular. Ícone, contatos, privacidade e os formulários exigidos devem corresponder ao candidato real. Nenhuma publicação ou data está prometida.
