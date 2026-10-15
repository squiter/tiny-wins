import { formatNumber, pluralForm, type InterfaceLanguage } from './locale';

// English source copy is the stable key; both languages share placeholders.
export const portuguese = {
  '{language}, selected': '{language}, selecionado',
  '{wins} of {planned} planned win': '{wins} de {planned} vitória planejada',
  Plant: 'Planta',
  Water: 'Água',
  Book: 'Livro',
  Walk: 'Caminhada',
  Stretch: 'Alongamento',
  Sun: 'Sol',
  Moon: 'Lua',
  Heart: 'Coração',
  Coffee: 'Café',
  Study: 'Estudo',
  Music: 'Música',
  Smile: 'Sorriso',
  'Could not open your habits': 'Não foi possível abrir seus hábitos',
  'Close any other Tiny Wins tabs and try again.':
    'Feche as outras abas do Tiny Wins e tente novamente.',
  'Please try again. If this continues, close and reopen Tiny Wins.':
    'Tente novamente. Se o problema continuar, feche e reabra o Tiny Wins.',
  'Try again': 'Tentar novamente',
  'Getting your tiny wins ready…': 'Preparando suas pequenas vitórias…',
  'Not scheduled today': 'Não planejado para hoje',
  Undo: 'Desfazer',
  Complete: 'Concluir',
  completed: 'concluído',
  complete: 'concluído',
  missed: 'não concluído',
  pending: 'pendente',
  future: 'futuro',
  'not scheduled': 'não planejado',
  'before habit started': 'antes do início do hábito',
  'within streak tolerance': 'dentro da tolerância da sequência',
  'not completed': 'não concluído',
  ', today': ', hoje',
  ', has note': ', com nota',
  'A win worth keeping.': 'Uma vitória para guardar.',
  'A little breathing room. Your sequence stayed intact; this day is not a completed win.':
    'Uma pausa para respirar. Sua sequência continua; este dia não conta como uma vitória concluída.',
  'A new start is always possible.': 'Sempre é possível recomeçar.',
  'This date is before your habit started.': 'Esta data é anterior ao início do hábito.',
  'A day to rest. Nothing was planned.': 'Um dia para descansar. Nada foi planejado.',
  'This day is still ahead.': 'Este dia ainda está por vir.',
  'Undo completion': 'Desfazer conclusão',
  'Mark completed': 'Marcar como concluído',
  'Could not save this day. Please try again.':
    'Não foi possível salvar este dia. Tente novamente.',
  'A little context': 'Um pouco de contexto',
  'An optional note for this day. It won’t change your win.':
    'Uma nota opcional para este dia. Ela não altera sua vitória.',
  'What would you like to remember?': 'O que você gostaria de lembrar?',
  'Done typing': 'Terminei de escrever',
  'Note saved.': 'Nota salva.',
  'Note cleared.': 'Nota removida.',
  'Could not save this note. Please try again.':
    'Não foi possível salvar esta nota. Tente novamente.',
  'Save note': 'Salvar nota',
  'Press Save note to clear it.': 'Toque em Salvar nota para confirmar a remoção.',
  'Clear note': 'Limpar nota',
  'Close day': 'Fechar dia',
  'Archived · ': 'Arquivado · ',
  'Jan → Dec': 'Jan → Dez',
  'One tile, one day': 'Um ladrilho, um dia',
  ' · All planned wins so far ✓': ' · Todas as vitórias planejadas até agora ✓',
  'Explore calendar →': 'Explorar calendário →',
  'Backup file prepared. Keep it somewhere safe.':
    'Arquivo de backup preparado. Guarde-o em um lugar seguro.',
  'Could not create a backup.': 'Não foi possível criar o backup. Tente novamente.',
  'Could not read this backup.':
    'Não foi possível ler este backup. Escolha um arquivo válido e tente novamente.',
  'Could not restore this backup.':
    'Não foi possível restaurar este backup. Seus dados atuais foram mantidos.',
  'Keep your tiny wins': 'Guarde suas pequenas vitórias',
  'Save a backup file to move or keep a copy of your habits, schedules, notes and history. Your file contains your habit data; choose where to save it.':
    'Salve um backup para levar seus hábitos, dias planejados, notas e histórico a outro aparelho ou guardar uma cópia. Escolha onde salvar o arquivo com seus dados.',
  'Export backup': 'Exportar backup',
  'Choose backup to restore': 'Escolher backup para restaurar',
  'Ready to restore': 'Pronto para restaurar',
  'Adds missing habits, wins and notes. Existing note text is kept. Existing names, colors, schedules and order stay as you have them.':
    'Adiciona hábitos, vitórias e notas que faltam. Notas existentes são preservadas, assim como os nomes, cores, dias planejados e a ordem dos hábitos atuais.',
  'Restore missing data': 'Restaurar dados que faltam',
  'Cancel restore': 'Cancelar restauração',
  'Preparing your file…': 'Preparando seu arquivo…',
  January: 'Janeiro',
  February: 'Fevereiro',
  March: 'Março',
  April: 'Abril',
  May: 'Maio',
  June: 'Junho',
  July: 'Julho',
  August: 'Agosto',
  September: 'Setembro',
  October: 'Outubro',
  November: 'Novembro',
  December: 'Dezembro',
  'A little room to breathe.': 'Um espaço para respirar.',
  'Nothing planned today. Make the day yours.':
    'Nada planejado para hoje. Aproveite o dia do seu jeito.',
  'Use a habit name of 1–80 characters.': 'Use um nome de hábito com 1 a 80 caracteres.',
  'Choose at least one weekday.': 'Escolha pelo menos um dia da semana.',
  'We couldn’t save your habit. Please try again.':
    'Não foi possível salvar seu hábito. Tente novamente.',
  'Close habit editor': 'Fechar editor de hábito',
  'Edit habit': 'Editar hábito',
  'New habit': 'Novo hábito',
  'One small step': 'Um pequeno passo',
  'Habit name': 'Nome do hábito',
  'Need an idea?': 'Quer uma ideia?',
  'A small place to start': 'Um pequeno começo',
  'Choose an idea, then make it yours. Nothing is saved until you create the habit.':
    'Escolha uma ideia e deixe do seu jeito. Nada é salvo até você criar o hábito.',
  'Read one page': 'Ler uma página',
  'Drink water': 'Beber água',
  'Take a short walk': 'Fazer uma caminhada curta',
  'Use idea: {title}': 'Usar ideia: {title}',
  'Use idea: {title}, selected': 'Usar ideia: {title}, selecionada',
  'e.g. Read one page': 'Ex.: Ler uma página',
  Icon: 'Ícone',
  'Habit icon': 'Ícone do hábito',
  Color: 'Cor',
  'Habit color': 'Cor do hábito',
  Frequency: 'Frequência',
  'Every day': 'Todos os dias',
  Weekdays: 'Dias úteis',
  'Scheduled weekdays': 'Dias planejados da semana',
  Sunday: 'Domingo',
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
  'Frequency changes start tomorrow. Past wins stay on their original dates.':
    'Mudanças de frequência começam amanhã. As vitórias anteriores ficam nas datas originais.',
  'Choose the days that work for you.': 'Escolha os dias que funcionam para você.',
  'Advanced options': 'Opções avançadas',
  'Streak flexibility': 'Flexibilidade da sequência',
  'Decrease streak tolerance': 'Diminuir tolerância da sequência',
  'Increase streak tolerance': 'Aumentar tolerância da sequência',
  'Soft ○ tiles keep your rhythm visible. Only completed days count as wins.':
    'Ladrilhos suaves com ○ mostram seu ritmo. Só os dias concluídos contam como vitórias.',
  ' Changes start tomorrow.': ' As mudanças começam amanhã.',
  'Save changes': 'Salvar alterações',
  'Create habit': 'Criar hábito',
  'Taking a break? Your past wins will stay here.':
    'Vai dar uma pausa? Suas vitórias anteriores ficam aqui.',
  'Archive habit': 'Arquivar hábito',
  Cancel: 'Cancelar',
  'Habit not found': 'Hábito não encontrado',
  'Back to Today': 'Voltar para Hoje',
  'Go back': 'Voltar',
  'YOUR PROGRESS': 'SEU PROGRESSO',
  'Restore habit': 'Restaurar hábito',
  'Archived · past wins are saved': 'Arquivado · vitórias anteriores preservadas',
  'New schedule starts tomorrow.': 'Os novos dias planejados começam amanhã.',
  'Previous month': 'Mês anterior',
  'Next month': 'Próximo mês',
  'Add a note for today': 'Adicionar uma nota para hoje',
  'Current streak': 'Sequência atual',
  'Previous year': 'Ano anterior',
  'Next year': 'Próximo ano',
  'Each square is one day. Tap a past day to inspect it; changes require a separate confirmation below.':
    'Cada quadrado é um dia. Toque em um dia anterior para ver os detalhes; alterações precisam de uma confirmação abaixo.',
  'Colored ✓ completed · soft ○ within tolerance · pale missed · dashed – not scheduled · blank before start or future. Corner mark: has note. Today is outlined.':
    'Colorido ✓ concluído · suave ○ dentro da tolerância · claro não concluído · tracejado – não planejado · vazio antes do início ou no futuro. Marca no canto: com nota. Hoje tem contorno.',
  'Consistency includes scheduled dates through today. Days before creation, future days and rest days are excluded.':
    'A consistência considera as datas planejadas até hoje. Dias anteriores à criação, futuros e de descanso ficam de fora.',
  'Progress happens one small step at a time.':
    'O progresso acontece um pequeno passo de cada vez.',
  'Could not archive this habit. Please try again.':
    'Não foi possível arquivar este hábito. Tente novamente.',
  Today: 'Hoje',
  Insights: 'Progresso',
  Settings: 'Ajustes',
  'One tile, one tiny win. Look at what you’re building.':
    'Um ladrilho, uma pequena vitória. Veja o que você está construindo.',
  'Report period': 'Período do relatório',
  'Previous report period': 'Período anterior do relatório',
  'Return report to today': 'Voltar o relatório para hoje',
  'Next report period': 'Próximo período do relatório',
  'Tap a tile to inspect its date. Marking or undoing a win needs a separate confirmation.':
    'Toque em um ladrilho para ver a data. Marcar ou desfazer uma vitória exige uma confirmação separada.',
  'Your first win starts something.': 'Sua primeira vitória é um começo.',
  'Create a habit in Today to begin filling your wall.':
    'Crie um hábito em Hoje para começar a preencher seu mural.',
  'Go to Today →': 'Ir para Hoje →',
  'Consistency · planned days': 'Consistência · dias planejados',
  'Consistency counts scheduled dates through today. Future days, rest days and dates before creation don’t count. Archived histories stay visible.':
    'A consistência considera datas planejadas até hoje. Dias futuros, de descanso e anteriores à criação não contam. Históricos arquivados continuam visíveis.',
  'A missed day never erases your wins.': 'Um dia perdido nunca apaga suas vitórias.',
  'We couldn’t save that change. Please try again.':
    'Não foi possível salvar essa alteração. Tente novamente.',
  'We couldn’t archive your habit. Please try again.':
    'Não foi possível arquivar seu hábito. Tente novamente.',
  Archived: 'Arquivados',
  'Your wins are always yours.': 'Suas vitórias são sempre suas.',
  'Your habits': 'Seus hábitos',
  'Done reordering': 'Concluir reordenação',
  'Reorder habits': 'Reordenar hábitos',
  Done: 'Concluir',
  Reorder: 'Reordenar',
  'Dismiss message': 'Fechar mensagem',
  'Start with one small thing.': 'Comece com uma pequena coisa.',
  'A glass of water. A page of a book. A moment to breathe. Make it yours.':
    'Um copo de água. Uma página de um livro. Um instante para respirar. Do seu jeito.',
  'Create your first habit': 'Criar meu primeiro hábito',
  'Nothing tucked away.': 'Nada guardado por aqui.',
  'Archived habits appear here, with their past wins kept safe.':
    'Hábitos arquivados aparecem aqui, com suas vitórias anteriores preservadas.',
  'Past wins are saved': 'Vitórias anteriores preservadas',
  Restore: 'Restaurar',
  'Past 14 days · today outlined · soft ○ within tolerance':
    'Últimos 14 dias · hoje com contorno · suave ○ dentro da tolerância',
  '← Back to Today': '← Voltar para Hoje',
  'Consistency over perfection.': 'Consistência acima da perfeição.',
  'We couldn’t save your preference. Please try again.':
    'Não foi possível salvar sua preferência. Tente novamente.',
  'Your habits stay with you': 'Seus hábitos ficam com você',
  'This preview stores your wins in this browser. Keep one Tiny Wins tab open at a time.':
    'Esta prévia guarda suas vitórias neste navegador. Mantenha apenas uma aba do Tiny Wins aberta por vez.',
  'Your habits and wins are stored on this device.':
    'Seus hábitos e vitórias ficam neste aparelho.',
  'Tiny Wins does not send your habit data to a server. Use a backup file when moving devices.':
    'O Tiny Wins não envia os dados dos seus hábitos para um servidor. Use um backup para trocar de aparelho.',
  'Make the calendar yours': 'O calendário do seu jeito',
  'Start your week on': 'Começar a semana em',
  'First day of the week': 'Primeiro dia da semana',
  'Saved on this device. Changes the monthly and yearly calendar layout. Your schedules and past wins stay the same.':
    'Salvo neste aparelho. Muda a organização dos calendários mensal e anual. Os dias planejados e as vitórias anteriores continuam iguais.',
  'Make yourself comfortable': 'Fique à vontade',
  Appearance: 'Aparência',
  System: 'Sistema',
  Light: 'Claro',
  Dark: 'Escuro',
  'System follows your device. Your choice is saved here; your wins and notes stay the same.':
    'Sistema acompanha seu aparelho. A escolha fica salva aqui; suas vitórias e notas continuam iguais.',
  'Celebrate your little wins': 'Celebre suas pequenas vitórias',
  'Celebration animations': 'Animações de celebração',
  'Gentle feedback for a win, and a little extra warmth when your day is complete. System reduced motion always takes priority.':
    'Um toque de celebração para cada vitória e um carinho extra ao concluir o dia. A redução de movimento do sistema sempre tem prioridade.',
  'Your device requests reduced motion, so wins stay quietly celebrated.':
    'Seu aparelho pede menos movimento, então as vitórias são celebradas de forma discreta.',
  'Your local calendar': 'Seu calendário local',
  'A win belongs to the calendar date you completed it on. Travel does not move your past wins.':
    'Uma vitória pertence à data em que você a concluiu. Viajar não muda suas vitórias anteriores de dia.',
  'Archived habits →': 'Hábitos arquivados →',
  'Take a break and come back when you’re ready.': 'Faça uma pausa e volte quando quiser.',
  'View the project on GitHub ↗': 'Ver o projeto no GitHub ↗',
  'Small steps. Big changes.': 'Pequenos passos. Grandes mudanças.',
  Language: 'Idioma',
  'Interface language': 'Idioma da interface',
  'System follows your device language. Habit names and notes stay as you wrote them.':
    'Sistema acompanha o idioma do aparelho. Os nomes dos hábitos e as notas ficam como você escreveu.',
  Week: 'Semana',
  Month: 'Mês',
  Year: 'Ano',
  '{count} saved habit': '{count} hábito guardado',
  '{count} saved habits': '{count} hábitos guardados',
  '{count} win in a row': '{count} vitória seguida',
  '{count} wins in a row': '{count} vitórias seguidas',
  '{wins} of {planned} planned wins': '{wins} de {planned} vitórias planejadas',
  '{title} archived. You can restore it below.': '{title} arquivado. Você pode restaurá-lo abaixo.',
  '{title} restored. Find it in Today.': '{title} restaurado. Encontre-o em Hoje.',
  'Restore {title}': 'Restaurar {title}',
  'Archived habits ({count})': 'Hábitos arquivados ({count})',
  'View {title}, {status}': 'Ver {title}, {status}',
  'Move {title} down': 'Mover {title} para baixo',
  'Move {title} up': 'Mover {title} para cima',
  'Undo {title} today': 'Desfazer {title} hoje',
  'Complete {title} today': 'Concluir {title} hoje',
  'Inspect {title}, {date}': 'Ver {title}, {date}',
  'View {title} progress': 'Ver progresso de {title}',
  'Explore {title} calendar with larger dates': 'Explorar calendário de {title} com datas maiores',
  '{title}: one more tile filled. ✓': '{title}: mais um ladrilho preenchido. ✓',
  '{title}: win undone.': '{title}: vitória desfeita.',
  'This week, together': 'Nesta semana, juntos',
  'This month, together': 'Neste mês, juntos',
  'This year, together': 'Neste ano, juntos',
  'Wins this week': 'Vitórias nesta semana',
  'Wins this month': 'Vitórias neste mês',
  'Wins this year': 'Vitórias neste ano',
  '{count} win this week': '{count} vitória nesta semana',
  '{count} wins this week': '{count} vitórias nesta semana',
  '{count} win this month': '{count} vitória neste mês',
  '{count} wins this month': '{count} vitórias neste mês',
  '{count} win this year': '{count} vitória neste ano',
  '{count} wins this year': '{count} vitórias neste ano',
  'Best streak · {year}': 'Melhor sequência · {year}',
  'Consistency · {year}': 'Consistência · {year}',
  'Total wins · {year}': 'Total de vitórias · {year}',
  '{icon} icon': 'Ícone de {icon}',
  '{color} color': 'Cor {color}',
  forest: 'verde floresta',
  blue: 'azul',
  coral: 'coral',
  violet: 'violeta',
  teal: 'verde azulado',
  amber: 'âmbar',
  ' · {count} day tolerance': ' · tolerância de {count} dia',
  ' · {count} days tolerance': ' · tolerância de {count} dias',
  'Allow up to {count} missed scheduled day between wins. Each win renews the allowance.':
    'Permita até {count} dia planejado sem conclusão entre vitórias. Cada vitória renova a tolerância.',
  'Allow up to {count} missed scheduled days between wins. Each win renews the allowance.':
    'Permita até {count} dias planejados sem conclusão entre vitórias. Cada vitória renova a tolerância.',
  '{count} scheduled day of tolerance': '{count} dia planejado de tolerância',
  '{count} scheduled days of tolerance': '{count} dias planejados de tolerância',
  'This changes only the completion on {date}.': 'Isso altera apenas a conclusão em {date}.',
  'Undo completion for {date}': 'Desfazer conclusão em {date}',
  'Mark completed for {date}': 'Marcar como concluído em {date}',
  'Note for {date}': 'Nota de {date}',
  '{appearance} appearance': 'Aparência: {appearance}',
  '{appearance} appearance, selected': 'Aparência: {appearance}, selecionada',
  'Celebration animations, on': 'Animações de celebração, ativadas',
  'Celebration animations, off': 'Animações de celebração, desativadas',
  'Save Tiny Wins backup': 'Salvar backup do Tiny Wins',
  '{count} habit': '{count} hábito',
  '{count} habits': '{count} hábitos',
  '{count} win': '{count} vitória',
  '{count} wins': '{count} vitórias',
  '{count} note': '{count} nota',
  '{count} notes': '{count} notas',
  '{habits} and {wins} and {notes} added. Your existing habits were kept.':
    'Adicionados: {habits}, {wins} e {notes}. Seus hábitos atuais foram mantidos.',
  'This is not a valid Tiny Wins backup.': 'Este não é um backup válido do Tiny Wins.',
  'The backup contains an invalid field.': 'O backup contém um campo inválido.',
  'The backup contains an invalid habit ID.':
    'O backup contém um identificador de hábito inválido.',
  'The backup contains an invalid timestamp.': 'O backup contém um registro de horário inválido.',
  'The backup contains an unsupported start date.':
    'O backup contém uma data de início não compatível.',
  'The backup contains an invalid habit order.': 'O backup contém uma ordem de hábitos inválida.',
  'The backup contains an invalid schedule.': 'O backup contém dias planejados inválidos.',
  'The backup schedule dates are not in order.':
    'As datas dos dias planejados do backup estão fora de ordem.',
  'Choose a backup smaller than 5 MB.': 'Escolha um backup menor que 5 MB.',
  'This file is not a valid Tiny Wins backup.': 'Este arquivo não é um backup válido do Tiny Wins.',
  'This backup format is not supported.': 'Este formato de backup não é compatível.',
  'This backup has too many records.': 'Este backup tem registros demais.',
  'The backup contains duplicate habits.': 'O backup contém hábitos duplicados.',
  'The backup contains an invalid timezone.': 'O backup contém um fuso horário inválido.',
  'The backup contains invalid or duplicate wins.':
    'O backup contém vitórias inválidas ou duplicadas.',
  'The backup contains invalid notes.': 'O backup contém notas inválidas.',
  'The backup contains invalid or duplicate notes.':
    'O backup contém notas inválidas ou duplicadas.',
  'This backup conflicts with existing habit history.':
    'Este backup conflita com o histórico de um hábito existente.',
  'This backup contains an invalid win.': 'Este backup contém uma vitória inválida.',
  'This backup contains an invalid note.': 'Este backup contém uma nota inválida.',
  'File sharing is not available on this device.':
    'O compartilhamento de arquivos não está disponível neste aparelho.',
  'Invalid calendar date': 'Data de calendário inválida',
  'Choose a streak tolerance from 0 to 7 scheduled days.':
    'Escolha uma tolerância de 0 a 7 dias planejados.',
  'All done for today!\nYou grew a little.': 'Tudo feito por hoje!\nVocê cresceu um pouco.',
  'Small wins today,\nbrighter tomorrows.': 'Pequenas vitórias hoje,\num amanhã mais leve.',
  '✓ Win · soft ○ Within tolerance · • Pending / missed · – Rest\nCorner mark: has note. Empty outline: before start · Dashed outline: future':
    '✓ Vitória · suave ○ Dentro da tolerância · • Pendente / não concluído · – Descanso\nMarca no canto: com nota. Contorno vazio: antes do início · Tracejado: futuro',
} as const;
export type MessageKey = keyof typeof portuguese;
export type MessageValues = Readonly<Record<string, string | number>>;
export function translate(
  language: InterfaceLanguage,
  key: MessageKey,
  values: MessageValues = {},
): string {
  const template: string = language === 'pt-BR' ? portuguese[key] : key;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`Missing message value: ${name}`);
    return typeof value === 'number'
      ? formatNumber(value, language, { useGrouping: false })
      : value;
  });
}
export function translateCount(
  language: InterfaceLanguage,
  count: number,
  one: MessageKey,
  other: MessageKey,
): string {
  return translate(language, pluralForm(count, language) === 'one' ? one : other, { count });
}
export function translatedFailure(
  language: InterfaceLanguage,
  failure: unknown,
  fallback: MessageKey,
): string {
  const key = failure instanceof Error ? failure.message : '';
  return translate(language, Object.hasOwn(portuguese, key) ? (key as MessageKey) : fallback);
}
