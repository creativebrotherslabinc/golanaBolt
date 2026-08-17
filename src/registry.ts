import type { ComponentType } from 'react';
import type { Tool } from './catalog';
import * as pdf from './tools/pdf';
import * as media from './tools/media';
import * as calc from './tools/calculators';
import * as util from './tools/utilities';
import * as ai from './tools/ai';
import * as dev from './tools/developer';
import * as time from './tools/time';
import * as games from './tools/games';
import * as games2 from './tools/games2';
import * as wa from './tools/whatsapp';
import * as hr from './tools/hr';
import * as mkt from './tools/marketing';
import * as edu from './tools/education';
import * as health from './tools/health';
import * as content from './tools/content';
import * as filetext from './tools/filetext';
import * as business from './tools/business';
import * as kids from './tools/kids';
import { FindingMyFood } from './tools/findingmyfood';
import { ResumeGenie } from './tools/resume';

export const toolComponents: Record<string, ComponentType<{ tool: Tool }>> = {
  // pdf
  'pdf-merger': pdf.PdfMerger,
  'pdf-splitter': pdf.PdfSplitter,
  'pdf-compressor': pdf.PdfCompressor,
  'pdf-to-docx': pdf.PdfToDocx,
  'docx-to-pdf': pdf.DocxToPdf,
  'txt-to-pdf': pdf.TxtToPdf,
  'images-to-pdf': pdf.ImagesToPdf,
  'pdf-to-images': pdf.PdfToImages,
  // media
  'image-compressor': media.ImageCompressor,
  'image-converter': media.ImageConverter,
  'video-compressor': media.VideoCompressor,
  'video-to-audio': media.VideoToAudio,
  'audio-cutter': media.AudioCutter,
  'image-resizer': media.ImageResizer,
  'image-to-base64': media.ImageToBase64,
  'color-palette': media.ColorPaletteGenerator,
  'gradient-generator': media.GradientGenerator,
  'font-previewer': media.FontPreviewer,
  'favicon-generator': media.FaviconGenerator,
  'gif-maker': media.GifMaker,
  'meme-generator': media.MemeGenerator,
  // calculators
  mortgage: calc.Mortgage,
  loan: calc.Loan,
  interest: calc.Interest,
  savings: calc.Savings,
  currency: calc.CurrencyConverter,
  'salary-tax': calc.SalaryTax,
  roi: calc.Roi,
  percentage: calc.Percentage,
  // utilities
  'qr-generator': util.QrGenerator,
  'password-generator': util.PasswordGenerator,
  'unit-converter': util.UnitConverter,
  'age-calculator': util.AgeCalculator,
  'date-difference': util.DateDifference,
  'bmi-calculator': util.BmiCalculator,
  'random-number': util.RandomNumber,
  'text-case': util.TextCase,
  'word-counter': util.WordCounter,
  'timer-pomodoro': util.TimerPomodoro,
  'cooking-converter': util.CookingConverter,
  'text-encryption': util.TextEncryption,
  'ip-lookup': util.IpLookup,
  'url-shortener': util.UrlShortener,
  'visitor-counter': util.VisitorCounter,
  'session-timer': util.SessionTimer,
  // ai
  summarizer: ai.TextSummarizer,
  paraphraser: ai.Paraphraser,
  'name-generator': ai.NameGenerator,
  'resume-bullets': ai.ResumeBullets,
  'joke-generator': ai.JokeGenerator,
  'story-generator': ai.StoryGenerator,
  'love-calculator': ai.LoveCalculator,
  'horoscope-generator': ai.HoroscopeGenerator,
  'fortune-cookie': ai.FortuneCookie,
  'would-you-rather': ai.WouldYouRather,
  'truth-or-dare': ai.TruthOrDare,
  'business-name-generator': ai.BusinessNameGenerator,
  'tagline-generator': ai.TaglineGenerator,
  // developer
  'json-formatter': dev.JsonFormatter,
  base64: dev.Base64Tool,
  'code-minifier': dev.CodeMinifier,
  'regex-tester': dev.RegexTester,
  'color-picker': dev.ColorPicker,
  'diff-checker': dev.DiffChecker,
  'uuid-generator': dev.UuidGenerator,
  'markdown-editor': dev.MarkdownEditor,
  'code-beautifier': dev.CodeBeautifier,
  // time
  'world-clock': time.WorldClock,
  stopwatch: time.Stopwatch,
  countdown: time.Countdown,
  'cooking-timer': time.CookingTimer,
  'calendar-widget': time.CalendarWidget,
  'todo-list': time.TodoList,
  'notes-app': time.NotesApp,
  'habit-tracker': time.HabitTracker,
  // games
  'tic-tac-toe': games.TicTacToe,
  'number-guess': games.NumberGuess,
  '2048': games2.Game2048,
  snake: games2.Snake,
  'memory-match': games2.MemoryMatch,
  'flappy-bird': games2.FlappyBird,
  tetris: games2.Tetris,
  minesweeper: games2.Minesweeper,
  sudoku: games2.Sudoku,
  hangman: games2.Hangman,
  'rock-paper-scissors': games2.RockPaperScissors,
  'typing-speed': games2.TypingSpeed,
  pong: games2.Pong,
  breakout: games2.Breakout,
  'connect-four': games2.ConnectFour,
  checkers: games2.Checkers,
  'sliding-puzzle': games2.SlidingPuzzle,
  'whack-a-mole': games2.WhackAMole,
  'simon-says': games2.SimonSays,
  'color-matching': games2.ColorMatching,
  'trivia-quiz': games2.TriviaQuiz,
  'card-matching': games2.CardMatching,
  platformer: games2.Platformer,
  'brick-breaker': games2.BrickBreaker,
  'aim-trainer': games2.AimTrainer,
  'reaction-time': games2.ReactionTime,
  // apps
  findingmyfood: FindingMyFood,
  'resume-genie': ResumeGenie,
  // whatsapp
  'wa-message-template': wa.WaMessageTemplate,
  'wa-quick-reply': wa.WaQuickReply,
  'wa-link-generator': wa.WaLinkGenerator,
  'wa-qr-code': wa.WaQrCode,
  'wa-broadcast': wa.WaBroadcast,
  'wa-promo': wa.WaPromoMessage,
  'wa-greeting': wa.WaGreetingMessage,
  'wa-follow-up': wa.WaFollowUpReminder,
  'wa-appointment': wa.WaAppointmentScheduler,
  'wa-order-form': wa.WaOrderForm,
  'wa-product-catalog': wa.WaProductCatalog,
  'wa-customer-card': wa.WaCustomerCard,
  'wa-survey': wa.WaSurvey,
  'wa-feedback': wa.WaFeedbackForm,
  // hr
  'shift-schedule': hr.ShiftSchedule,
  timesheet: hr.Timesheet,
  'work-hours': hr.WorkHours,
  'break-timer': hr.BreakTimer,
  'attendance-tracker': hr.AttendanceTracker,
  'onboarding-checklist': hr.OnboardingChecklist,
  // marketing
  'meta-tag-generator': mkt.MetaTagGenerator,
  'keyword-density-checker': mkt.KeywordDensityChecker,
  'utm-builder': mkt.UtmBuilder,
  'popup-builder': mkt.PopupBuilder,
  'pricing-table-generator': mkt.PricingTableGenerator,
  'faq-accordion-builder': mkt.FaqAccordionBuilder,
  'email-signature-generator': mkt.EmailSignatureGenerator,
  'invoice-generator': mkt.InvoiceGenerator,
  'logo-maker': mkt.LogoMaker,
  'social-post-template-maker': mkt.SocialPostTemplateMaker,
  // education
  'flashcard-creator': edu.FlashcardCreator,
  'study-planner': edu.StudyPlanner,
  'reading-timer': edu.ReadingTimer,
  'math-worksheet-generator': edu.MathWorksheetGenerator,
  'vocabulary-trainer': edu.VocabularyTrainer,
  'typing-practice': edu.TypingPractice,
  'exam-countdown': edu.ExamCountdown,
  // health
  'water-intake-tracker': health.WaterIntakeTracker,
  'step-counter': health.StepCounter,
  'workout-timer': health.WorkoutTimer,
  'stretch-reminder': health.StretchReminder,
  'meal-planner': health.MealPlanner,
  'calorie-counter': health.CalorieCounter,
  // content
  'headline-generator': content.HeadlineGenerator,
  'emoji-decorator': content.EmojiDecorator,
  'text-divider-generator': content.TextDividerGenerator,
  'social-bio-generator': content.SocialBioGenerator,
  'hashtag-generator': content.HashtagGenerator,
  'list-formatter': content.ListFormatter,
  'bullet-point-expander': content.BulletPointExpander,
  // filetext
  'text-cleaner': filetext.TextCleaner,
  'csv-viewer': filetext.CSVViewer,
  'html-escape-unescape': filetext.HTMLEscapeUnescape,
  'url-encoder-decoder': filetext.URLEncoderDecoder,
  'slug-generator': filetext.SlugGenerator,
  'text-sorter': filetext.TextSorter,
  'duplicate-line-remover': filetext.DuplicateLineRemover,
  // business
  'inventory-manager': business.InventoryManager,
  'simple-crm': business.SimpleCRM,
  'client-follow-up-tracker': business.ClientFollowUpTracker,
  'order-status-tracker': business.OrderStatusTracker,
  'business-expense-tracker': business.BusinessExpenseTracker,
  'profit-margin-calculator': business.ProfitMarginCalculator,
  // kids
  'chore-chart-generator': kids.ChoreChartGenerator,
  'reward-points-tracker': kids.RewardPointsTracker,
  'bedtime-routine-checklist': kids.BedtimeRoutineChecklist,
  'homework-planner': kids.HomeworkPlanner,
  'kids-drawing-pad': kids.KidsDrawingPad,
  'name-coloring-sheet-generator': kids.NameColoringSheetGenerator,
};
