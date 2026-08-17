import {
  FileText, Image as ImageIcon, Calculator, Wrench, Sparkles, Code2,
  Clock3, Gamepad2, AppWindow, MessageCircle, Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string; // tailwind gradient classes
  tools: Tool[];
}

// Icons reused for tools — we attach per-tool via a small icon map.
import {
  Combine, Scissors, FileDown, FileUp, FileText as FileTxt, Images, FileImage,
  Minimize2, Repeat, Video, Mic, ScissorsLineDashed,
  Home, Landmark, Percent, PiggyBank, DollarSign, Receipt, TrendingUp, Divide,
  QrCode, KeyRound, Ruler, Cake, CalendarRange, HeartPulse, Dices, CaseSensitive,
  FileClock, Timer, CookingPot,
  AlignLeft, RefreshCw, BadgeHelp, Laugh, BookOpen,
  Braces, Binary, Minimize, Regex, Pipette, GitCompare,
  Globe, Watch, Hourglass,
  Grid3x3, Hash,
  Utensils, FileUser,
  // New media icons
  Maximize2, Binary as Base64Icon, Palette, Layers, Type, Image as FaviconIcon, Film, Smile,
  // New games icons
  Grid2x2, Worm, Brain, Bird, Boxes, Bomb, Hash as SudokuIcon, Puzzle, Gamepad2 as GamepadIcon,
  Hand, Keyboard, Disc, Square, Circle, Grid as GridIcon, SlidersHorizontal,
  Hammer, Music, Eye, HelpCircle, Layers as CardsIcon, Footprints, Target, Zap,
  // WhatsApp icons
  LayoutTemplate, Reply, Link, ScanLine, Megaphone, Gift, PartyPopper, BellRing,
  CalendarClock, ShoppingCart, Package, Contact, BarChart3, MessageSquare,
  // HR icons
  CalendarDays, Clock, Clock3 as ClockIcon, Coffee, CheckSquare, ClipboardList,
  // New utilities icons
  Lock, Network, Link2, Eye, Activity,
  // New AI icons
  Heart, Sparkle, Cookie, HelpCircle, Drama, Building2, Quote,
  // New developer icons
  Fingerprint, FileText as FileTextIcon, Wand2,
  // New time icons
  Calendar, ListTodo, StickyNote, Repeat,
  // New marketing icons
  Tag, Search, Link2, PanelTopOpen, Table, HelpCircle, Mail, Receipt, Palette, Share2,
  // New education icons
  GraduationCap, Layers, BookOpen as BookOpenIcon, Calculator as CalcIcon, BookA, Keyboard as KeyboardIcon, Hourglass as HourglassIcon,
  // New health icons
  Droplets, Footprints, Dumbbell, PersonStanding, UtensilsCrossed, Flame,
  // New content icons
  Newspaper, Smile, Minus, Hash, List, PenLine,
  // New filetext icons
  Code, Link as LinkIcon, Slash, ArrowDownAZ, CopyX,
  // New business icons
  Briefcase, UserCheck, Truck, Wallet, PackageCheck, UserPlus,
  // New kids icons
  Baby, Star, Moon, Pencil, Brush, ListChecks, Award, Eraser,
} from 'lucide-react';

const i = (slug: string, name: string, description: string, icon: LucideIcon): Tool => ({
  slug, name, description, icon,
});

export const categories: Category[] = [
  {
    id: 'pdf',
    title: 'PDF & Document Tools',
    subtitle: 'Merge, split, and convert PDF files instantly in your browser.',
    icon: FileText,
    accent: 'from-rose-500 to-orange-500',
    tools: [
      i('pdf-merger', 'PDF Merger', 'Combine multiple PDFs into one document.', Combine),
      i('pdf-splitter', 'PDF Splitter', 'Split a PDF into separate pages or ranges.', Scissors),
      i('pdf-compressor', 'PDF Compressor', 'Reduce PDF file size while keeping quality.', Minimize2),
      i('pdf-to-docx', 'PDF to DOCX', 'Convert PDF pages into editable text.', FileDown),
      i('docx-to-pdf', 'DOCX to PDF', 'Convert a text document into a PDF.', FileUp),
      i('txt-to-pdf', 'TXT to PDF', 'Turn plain text files into a clean PDF.', FileTxt),
      i('images-to-pdf', 'Images to PDF', 'Combine images into a single PDF.', Images),
      i('pdf-to-images', 'PDF to Images', 'Export each PDF page as an image.', FileImage),
    ],
  },
  {
    id: 'media',
    title: 'Media Tools',
    subtitle: 'Compress, convert, and edit images, videos, and audio files.',
    icon: ImageIcon,
    accent: 'from-fuchsia-500 to-pink-500',
    tools: [
      i('image-compressor', 'Image Compressor', 'Shrink image files with quality control.', Minimize2),
      i('image-converter', 'Image Converter', 'Convert between PNG, JPEG, WebP.', Repeat),
      i('image-resizer', 'Image Resizer', 'Resize images to any dimension.', Maximize2),
      i('image-to-base64', 'Image to Base64', 'Convert an image to a Base64 string.', Base64Icon),
      i('color-palette', 'Color Palette Generator', 'Generate harmonious color palettes.', Palette),
      i('gradient-generator', 'Gradient Generator', 'Create CSS gradients visually.', Layers),
      i('font-previewer', 'Font Previewer', 'Preview text in different fonts.', Type),
      i('favicon-generator', 'Favicon Generator', 'Create a favicon from text.', FaviconIcon),
      i('gif-maker', 'GIF Maker', 'Combine images into an animated GIF.', Film),
      i('meme-generator', 'Meme Generator', 'Add top and bottom text to images.', Smile),
      i('color-picker', 'Color Picker', 'Pick colors and copy formats.', Pipette),
      i('video-compressor', 'Video Compressor', 'Reduce video size in the browser.', Video),
      i('video-to-audio', 'Video to Audio', 'Extract the audio track from a video.', Mic),
      i('audio-cutter', 'Audio Cutter', 'Trim audio to a chosen segment.', ScissorsLineDashed),
    ],
  },
  {
    id: 'calculators',
    title: 'Calculators & Finance Tools',
    subtitle: 'Financial, investment, and everyday mathematical calculators.',
    icon: Calculator,
    accent: 'from-emerald-500 to-teal-500',
    tools: [
      i('mortgage', 'Mortgage Calculator', 'Estimate monthly mortgage payments.', Home),
      i('loan', 'Loan Calculator', 'Calculate loan payments and interest.', Landmark),
      i('interest', 'Interest Calculator', 'Simple and compound interest.', Percent),
      i('savings', 'Savings Calculator', 'Plan savings growth over time.', PiggyBank),
      i('currency', 'Currency Converter', 'Convert between world currencies.', DollarSign),
      i('salary-tax', 'Salary Tax Calc', 'Estimate take-home pay after tax.', Receipt),
      i('roi', 'ROI Calculator', 'Measure return on investment.', TrendingUp),
      i('percentage', 'Percentage Calculator', 'Common percentage operations.', Divide),
    ],
  },
  {
    id: 'utilities',
    title: 'Everyday Utilities',
    subtitle: 'Handy tools for daily tasks, conversions, and generation.',
    icon: Wrench,
    accent: 'from-sky-500 to-blue-500',
    tools: [
      i('qr-generator', 'QR Code Generator', 'Make QR codes for any text or link.', QrCode),
      i('password-generator', 'Password Generator', 'Create strong random passwords.', KeyRound),
      i('unit-converter', 'Unit Converter', 'Convert length, weight, temp and more.', Ruler),
      i('age-calculator', 'Age Calculator', 'Find exact age in years, months, days.', Cake),
      i('date-difference', 'Date Difference', 'Count days between two dates.', CalendarRange),
      i('bmi-calculator', 'BMI Calculator', 'Check body mass index and range.', HeartPulse),
      i('random-number', 'Random Number', 'Pick random numbers in a range.', Dices),
      i('text-case', 'Text Case Converter', 'Change text capitalization styles.', CaseSensitive),
      i('word-counter', 'Word Counter', 'Count words, characters, sentences.', FileClock),
      i('timer-pomodoro', 'Timer & Pomodoro', 'Focus timer with Pomodoro cycles.', Timer),
      i('cooking-converter', 'Cooking Converter', 'Convert cups, spoons, grams.', CookingPot),
      i('text-encryption', 'Text Encryption Tool', 'Encrypt and decrypt text with a key.', Lock),
      i('ip-lookup', 'IP Lookup', 'Look up geolocation data for any IP.', Network),
      i('url-shortener', 'URL Shortener', 'Shorten long URLs instantly.', Link2),
      i('visitor-counter', 'Visitor Counter', 'Track page visits in local storage.', Eye),
      i('session-timer', 'Session Timer', 'Track time spent on tasks.', Activity),
    ],
  },
  {
    id: 'ai',
    title: 'AI Mini Tools',
    subtitle: 'Smart text generation and manipulation using mock AI models.',
    icon: Sparkles,
    accent: 'from-violet-500 to-purple-500',
    tools: [
      i('summarizer', 'Text Summarizer', 'Shorten text to key points.', AlignLeft),
      i('paraphraser', 'Paraphraser', 'Reword sentences clearly.', RefreshCw),
      i('name-generator', 'Name Generator', 'Generate creative names.', BadgeHelp),
      i('resume-bullets', 'Resume Bullets', 'Draft strong resume bullets.', FileUser),
      i('joke-generator', 'Joke Generator', 'Get a quick random joke.', Laugh),
      i('story-generator', 'Story Generator', 'Spin up a short story.', BookOpen),
      i('love-calculator', 'Love Calculator', 'Check your compatibility score.', Heart),
      i('horoscope-generator', 'Horoscope Generator', 'Get a daily horoscope reading.', Sparkle),
      i('fortune-cookie', 'Fortune Cookie Generator', 'Crack a cookie for your fortune.', Cookie),
      i('would-you-rather', 'Would You Rather Generator', 'Generate fun dilemmas to ponder.', HelpCircle),
      i('truth-or-dare', 'Truth or Dare Generator', 'Get a random truth or dare.', Drama),
      i('business-name-generator', 'Business Name Generator', 'Generate creative business names.', Building2),
      i('tagline-generator', 'Tagline Generator', 'Create catchy brand taglines.', Quote),
    ],
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    subtitle: 'Utilities for developers to format, test, and encode data.',
    icon: Code2,
    accent: 'from-slate-600 to-slate-800',
    tools: [
      i('json-formatter', 'JSON Formatter', 'Beautify or minify JSON.', Braces),
      i('base64', 'Base64 Tool', 'Encode and decode Base64 text.', Binary),
      i('code-minifier', 'Code Minifier', 'Minify JS and CSS quickly.', Minimize),
      i('regex-tester', 'Regex Tester', 'Test regex patterns live.', Regex),
      i('diff-checker', 'Text Diff Checker', 'Compare two pieces of text.', GitCompare),
      i('uuid-generator', 'UUID Generator', 'Generate v4 and v7 UUIDs.', Fingerprint),
      i('markdown-editor', 'Markdown Editor', 'Write and preview markdown live.', FileTextIcon),
      i('code-beautifier', 'Code Beautifier', 'Format JS, CSS, HTML, and JSON.', Wand2),
    ],
  },
  {
    id: 'time',
    title: 'Time & Planning Tools',
    subtitle: 'World clocks and time zone tools for planning across regions.',
    icon: Clock3,
    accent: 'from-amber-500 to-yellow-500',
    tools: [
      i('world-clock', 'World Clock', 'See times across major cities.', Globe),
      i('stopwatch', 'Stopwatch', 'Time any interval precisely.', Watch),
      i('countdown', 'Countdown Generator', 'Count down to any date.', Hourglass),
      i('cooking-timer', 'Cooking Timer', 'Kitchen timer with presets.', CookingPot),
      i('calendar-widget', 'Calendar Widget', 'Browse months and pick dates.', Calendar),
      i('todo-list', 'To-Do List', 'Track tasks with local storage.', ListTodo),
      i('notes-app', 'Notes App', 'Create and manage notes.', StickyNote),
      i('habit-tracker', 'Habit Tracker', 'Build daily habits with streaks.', Repeat),
    ],
  },
  {
    id: 'games',
    title: 'Games',
    subtitle: 'Quick fun games to play right in your browser.',
    icon: Gamepad2,
    accent: 'from-indigo-500 to-blue-500',
    tools: [
      i('tic-tac-toe', 'Tic-Tac-Toe', 'Classic 3x3 grid game.', Grid3x3),
      i('number-guess', 'Number Guess', 'Guess the hidden number.', Hash),
      i('2048', '2048', 'Slide and merge tiles to reach 2048.', Grid2x2),
      i('snake', 'Snake Game', 'Eat food and grow without crashing.', Worm),
      i('memory-match', 'Memory Match', 'Flip cards to find matching pairs.', Brain),
      i('flappy-bird', 'Flappy Bird', 'Tap to fly through pipes.', Bird),
      i('tetris', 'Tetris', 'Stack falling blocks and clear lines.', Boxes),
      i('minesweeper', 'Minesweeper', 'Clear the grid without hitting mines.', Bomb),
      i('sudoku', 'Sudoku Generator', 'Fill the 9x9 grid logically.', SudokuIcon),
      i('hangman', 'Hangman', 'Guess the word before the drawing completes.', Puzzle),
      i('rock-paper-scissors', 'Rock-Paper-Scissors', 'Classic hand game vs CPU.', Hand),
      i('typing-speed', 'Typing Speed Test', 'Measure your words per minute.', Keyboard),
      i('pong', 'Pong Game', 'Bounce the ball past the CPU paddle.', Disc),
      i('breakout', 'Breakout Game', 'Bounce the ball to break all bricks.', Square),
      i('connect-four', 'Connect Four', 'Drop discs to connect four in a row.', Circle),
      i('checkers', 'Checkers', 'Simple checkers vs another player.', GridIcon),
      i('sliding-puzzle', 'Sliding Puzzle', 'Arrange tiles 1-15 in order.', SlidersHorizontal),
      i('whack-a-mole', 'Whack-a-Mole', 'Hit moles before they disappear.', Hammer),
      i('simon-says', 'Simon Says', 'Repeat the color sequence.', Music),
      i('color-matching', 'Color Matching Game', 'Match the target color.', Eye),
      i('trivia-quiz', 'Trivia Quiz', 'Test your knowledge with quiz questions.', HelpCircle),
      i('card-matching', 'Card Matching Game', 'Find all matching pairs of cards.', CardsIcon),
      i('platformer', 'Simple Platformer', 'Jump across platforms on a canvas.', Footprints),
      i('brick-breaker', 'Brick Breaker', 'Break every brick on screen.', Square),
      i('aim-trainer', 'Aim Trainer', 'Click targets as fast as you can.', Target),
      i('reaction-time', 'Reaction Time Tester', 'Test how fast you react.', Zap),
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Business Tools',
    subtitle: 'Create, organize, and share customer messages and workflows through WhatsApp.',
    icon: MessageCircle,
    accent: 'from-green-500 to-emerald-600',
    tools: [
      i('wa-message-template', 'WhatsApp Message Template Builder', 'Build structured message templates.', LayoutTemplate),
      i('wa-quick-reply', 'WhatsApp Quick Reply Generator', 'Create and store quick replies.', Reply),
      i('wa-link-generator', 'WhatsApp Link Generator (wa.me)', 'Generate clickable WhatsApp links.', Link),
      i('wa-qr-code', 'WhatsApp QR Code Generator', 'Create a QR code for your WhatsApp.', ScanLine),
      i('wa-broadcast', 'WhatsApp Broadcast Message Composer', 'Send messages to multiple contacts.', Megaphone),
      i('wa-promo', 'WhatsApp Promo Message Generator', 'Create promotional messages with offers.', Gift),
      i('wa-greeting', 'WhatsApp Greeting Message Generator', 'Welcome customers with a friendly intro.', PartyPopper),
      i('wa-follow-up', 'WhatsApp Follow-Up Reminder Tool', 'Track and send follow-up reminders.', BellRing),
      i('wa-appointment', 'WhatsApp Appointment Scheduler', 'Schedule and confirm appointments.', CalendarClock),
      i('wa-order-form', 'WhatsApp Order Form Generator', 'Send orders via WhatsApp.', ShoppingCart),
      i('wa-product-catalog', 'Product Catalog Builder', 'Share your product catalog on WhatsApp.', Package),
      i('wa-customer-card', 'Customer Info Card Generator', 'Store customer details locally.', Contact),
      i('wa-survey', 'WhatsApp Survey Generator', 'Create surveys to send on WhatsApp.', BarChart3),
      i('wa-feedback', 'Feedback Form → WhatsApp', 'Collect and send feedback via WhatsApp.', MessageSquare),
    ],
  },
  {
    id: 'hr',
    title: 'HR & Employee Tools',
    subtitle: 'Simple tools for organizing schedules, hours, attendance, and employee workflows.',
    icon: Users,
    accent: 'from-orange-500 to-red-500',
    tools: [
      i('shift-schedule', 'Shift Schedule Generator', 'Assign employees to shifts automatically.', CalendarDays),
      i('timesheet', 'Employee Timesheet Generator', 'Track hours and export timesheets.', Clock),
      i('work-hours', 'Work Hours Calculator', 'Calculate daily and weekly work hours.', ClockIcon),
      i('break-timer', 'Break Timer Tool', 'Time your breaks with presets.', Coffee),
      i('attendance-tracker', 'Attendance Tracker', 'Track who showed up, late, or absent.', CheckSquare),
      i('onboarding-checklist', 'Employee Onboarding Checklist', 'Manage onboarding tasks for new hires.', ClipboardList),
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Web Tools',
    subtitle: 'Generate meta tags, pricing tables, popups, invoices, and more for your website.',
    icon: Megaphone,
    accent: 'from-cyan-500 to-blue-500',
    tools: [
      i('meta-tag-generator', 'Meta Tag Generator', 'Generate SEO and Open Graph meta tags.', Tag),
      i('keyword-density-checker', 'Keyword Density Checker', 'Analyze keyword frequency in content.', Search),
      i('utm-builder', 'UTM Builder', 'Build tracking URLs for campaigns.', Link2),
      i('popup-builder', 'Popup Builder', 'Design and export HTML popups.', PanelTopOpen),
      i('pricing-table-generator', 'Pricing Table Generator', 'Create responsive pricing tables.', Table),
      i('faq-accordion-builder', 'FAQ Accordion Builder', 'Build collapsible FAQ sections.', HelpCircle),
      i('email-signature-generator', 'Email Signature Generator', 'Create professional email signatures.', Mail),
      i('invoice-generator', 'Invoice Generator', 'Create and download invoices.', Receipt),
      i('logo-maker', 'Simple Logo Maker', 'Design and export simple logos.', Palette),
      i('social-post-template-maker', 'Social Media Post Template Maker', 'Create post templates for social platforms.', Share2),
    ],
  },
  {
    id: 'education',
    title: 'Education & Learning Tools',
    subtitle: 'Study smarter with flashcards, planners, worksheets, and timed practice.',
    icon: GraduationCap,
    accent: 'from-indigo-500 to-violet-500',
    tools: [
      i('flashcard-creator', 'Flashcard Creator', 'Create and study flashcard decks.', Layers),
      i('study-planner', 'Study Planner', 'Plan and track your study tasks.', ClipboardList),
      i('reading-timer', 'Reading Timer', 'Time reading sessions and track pages.', Timer),
      i('math-worksheet-generator', 'Math Worksheet Generator', 'Generate printable math problems.', CalcIcon),
      i('vocabulary-trainer', 'Vocabulary Trainer', 'Learn new words with quizzes.', BookA),
      i('typing-practice', 'Typing Practice Tool', 'Practice typing and measure WPM.', KeyboardIcon),
      i('exam-countdown', 'Exam Countdown Tool', 'Count down days to your exams.', HourglassIcon),
    ],
  },
  {
    id: 'health',
    title: 'Health & Wellness Tools',
    subtitle: 'Track hydration, steps, calories, plan meals, and stay active throughout the day.',
    icon: HeartPulse,
    accent: 'from-rose-500 to-pink-600',
    tools: [
      i('water-intake-tracker', 'Water Intake Tracker', 'Track daily water intake and goals.', Droplets),
      i('step-counter', 'Step Counter', 'Log daily steps and see progress.', Footprints),
      i('workout-timer', 'Workout Timer', 'Interval timer for work and rest rounds.', Dumbbell),
      i('stretch-reminder', 'Stretch Reminder Tool', 'Get periodic reminders to stretch.', PersonStanding),
      i('meal-planner', 'Meal Planner', 'Plan meals for the week ahead.', UtensilsCrossed),
      i('calorie-counter', 'Calorie Counter', 'Log foods and track daily calories.', Flame),
    ],
  },
  {
    id: 'content',
    title: 'Content Creation Tools',
    subtitle: 'Generate headlines, bios, hashtags, and format content for any platform.',
    icon: Sparkles,
    accent: 'from-fuchsia-500 to-purple-600',
    tools: [
      i('headline-generator', 'Headline Generator', 'Generate catchy headlines from templates.', Newspaper),
      i('emoji-decorator', 'Emoji Decorator', 'Add emojis to your text in various styles.', Smile),
      i('text-divider-generator', 'Text Divider Generator', 'Create decorative text dividers.', Minus),
      i('social-bio-generator', 'Social Bio Generator', 'Generate bios for social media profiles.', PenLine),
      i('hashtag-generator', 'Hashtag Generator', 'Generate relevant hashtags by category.', Hash),
      i('list-formatter', 'List Formatter', 'Format and sort lists in multiple styles.', List),
      i('bullet-point-expander', 'Bullet Point Expander', 'Expand bullet points into full text.', AlignLeft),
    ],
  },
  {
    id: 'filetext',
    title: 'File & Text Tools',
    subtitle: 'Clean, encode, sort, and transform text and CSV data right in your browser.',
    icon: FileTxt,
    accent: 'from-slate-500 to-slate-700',
    tools: [
      i('text-cleaner', 'Text Cleaner', 'Remove spaces, duplicates, and clean up text.', Eraser),
      i('csv-viewer', 'CSV Viewer', 'View and sort CSV data in a table.', Table),
      i('html-escape-unescape', 'HTML Escape/Unescape Tool', 'Escape or unescape HTML entities.', Code),
      i('url-encoder-decoder', 'URL Encoder/Decoder', 'Encode and decode URL strings.', LinkIcon),
      i('slug-generator', 'Slug Generator', 'Create URL-friendly slugs from text.', Slash),
      i('text-sorter', 'Text Sorter', 'Sort lines alphabetically or by length.', ArrowDownAZ),
      i('duplicate-line-remover', 'Duplicate Line Remover', 'Remove duplicate lines from text.', CopyX),
    ],
  },
  {
    id: 'business',
    title: 'Business Operations Tools',
    subtitle: 'Manage inventory, contacts, orders, expenses, and more for your small business.',
    icon: Briefcase,
    accent: 'from-blue-600 to-indigo-700',
    tools: [
      i('inventory-manager', 'Inventory List Manager', 'Track stock levels and item values.', Package),
      i('simple-crm', 'Simple CRM', 'Manage contacts and customer relationships.', Users),
      i('client-follow-up-tracker', 'Client Follow-Up Tracker', 'Track follow-ups with due dates.', UserCheck),
      i('order-status-tracker', 'Order Status Tracker', 'Track orders through fulfillment stages.', Truck),
      i('business-expense-tracker', 'Business Expense Tracker', 'Log expenses and see totals by category.', Wallet),
      i('profit-margin-calculator', 'Profit Margin Calculator', 'Calculate profit, margin, and markup.', Calculator),
    ],
  },
  {
    id: 'kids',
    title: 'Kids & Family Tools',
    subtitle: 'Chore charts, reward trackers, drawing pads, and planners for the whole family.',
    icon: Baby,
    accent: 'from-pink-500 to-rose-500',
    tools: [
      i('chore-chart-generator', 'Chore Chart Generator', 'Create chore charts for the week.', ListChecks),
      i('reward-points-tracker', 'Reward Points Tracker', 'Track kid points and redeem rewards.', Award),
      i('bedtime-routine-checklist', 'Bedtime Routine Checklist', 'A visual bedtime routine checklist.', Moon),
      i('homework-planner', 'Homework Planner', 'Track homework assignments by due date.', ClipboardList),
      i('kids-drawing-pad', 'Kids Drawing Pad', 'A canvas drawing pad for kids.', Pencil),
      i('name-coloring-sheet-generator', 'Name Coloring Sheet Generator', 'Generate printable name coloring sheets.', Brush),
    ],
  },
  {
    id: 'apps',
    title: 'Apps',
    subtitle: 'Full interactive apps that run right in your browser.',
    icon: AppWindow,
    accent: 'from-teal-500 to-cyan-500',
    tools: [
      i('findingmyfood', 'FindingMyFood', 'Find restaurants near you and let the roulette pick one.', Utensils),
      i('resume-genie', 'Resume Builder', 'Build a clean resume and export it.', FileUser),
    ],
  },
];

export const allTools = categories.flatMap((c) => c.tools.map((t) => ({ ...t, category: c.id })));

export function findTool(category: string, slug: string) {
  const cat = categories.find((c) => c.id === category);
  const tool = cat?.tools.find((t) => t.slug === slug);
  return cat && tool ? { category: cat, tool } : null;
}
