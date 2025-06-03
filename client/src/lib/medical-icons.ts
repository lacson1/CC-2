import {
  User, UserCheck, Users, UserPlus, UserX, UserCog,
  Heart, Activity, Monitor, TrendingUp, TrendingDown,
  Pill, Syringe, Beaker, FlaskConical, TestTube, Microscope,
  Calendar, CalendarDays, Clock, Timer, CalendarCheck, CalendarX,
  FileText, FileCheck, FilePlus, FileX, Files, Folder,
  MessageSquare, MessageCircle, Mail, Phone, Video, Mic,
  Stethoscope, Thermometer, Scale, Zap, Eye, Ear,
  Building2, Home, MapPin, Navigation, Car, Truck,
  Plus, Minus, X, Check, AlertCircle, AlertTriangle,
  Settings, Cog, Edit, Trash2, Save, Download, Upload,
  Search, Filter, SortAsc, SortDesc, MoreVertical, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowLeft, ArrowRight,
  Bell, BellRing, Flag, Bookmark, Star,
  Shield, ShieldCheck, Lock, Unlock, Key,
  Camera, Image, Paperclip, Link, QrCode, Barcode,
  Printer, Share, Copy, ExternalLink, RefreshCw, RotateCcw,
  Info, HelpCircle, CheckCircle, XCircle, AlertOctagon,
  Database, Server, Cloud, Wifi, WifiOff, Signal,
  Layout, LayoutGrid, LayoutList, Table, Grid, List,
  Target, Crosshair, Focus, Maximize, Minimize, Move,
  PlayCircle, PauseCircle, StopCircle, SkipForward, SkipBack,
  Volume2, VolumeX, MicOff, Headphones,
  CreditCard, DollarSign, Receipt, Wallet, PiggyBank,
  Package, ShoppingCart, Tag, Tags, Percent
} from "lucide-react";

// Healthcare Professional Icons
export const MedicalIcons = {
  // Patient & People Management
  patient: User,
  patients: Users,
  addPatient: UserPlus,
  removePatient: UserX,
  patientProfile: UserCheck,
  patientSettings: UserCog,
  
  // Vital Signs & Monitoring
  vitals: Activity,
  heartRate: Heart,
  bloodPressure: Heart,
  monitor: Monitor,
  temperature: Thermometer,
  weight: Scale,
  pulseOx: Zap,
  vision: Eye,
  hearing: Ear,
  stethoscope: Stethoscope,
  trending: TrendingUp,
  declining: TrendingDown,
  
  // Medications & Pharmacy
  medication: Pill,
  prescription: FileText,
  injection: Syringe,
  dosage: Beaker,
  labSample: TestTube,
  laboratory: Microscope,
  pharmacy: Building2,
  dispense: Package,
  
  // Scheduling & Time
  appointment: Calendar,
  schedule: CalendarDays,
  time: Clock,
  timer: Timer,
  confirmed: CalendarCheck,
  cancelled: CalendarX,
  
  // Documentation & Records
  record: FileText,
  newRecord: FilePlus,
  verified: FileCheck,
  incomplete: FileX,
  documents: Files,
  folder: Folder,
  
  // Communication
  message: MessageSquare,
  chat: MessageCircle,
  email: Mail,
  phone: Phone,
  video: Video,
  microphone: Mic,
  
  // Emergency & Alerts
  emergency: AlertTriangle,
  urgent: AlertCircle,
  critical: AlertOctagon,
  warning: Warning,
  normal: CheckCircle,
  alert: Bell,
  notification: BellRing,
  
  // Security & Access
  security: Shield,
  verified: ShieldCheck,
  locked: Lock,
  unlocked: Unlock,
  access: Key,
  userAccess: UserShield,
  
  // Actions & Operations
  add: Plus,
  remove: Minus,
  close: X,
  confirm: Check,
  edit: Edit,
  delete: Trash2,
  save: Save,
  download: Download,
  upload: Upload,
  
  // Navigation & Search
  search: Search,
  filter: Filter,
  sort: SortAsc,
  sortDesc: SortDesc,
  more: MoreVertical,
  moreHorizontal: MoreHorizontal,
  back: ChevronLeft,
  forward: ChevronRight,
  up: ChevronUp,
  down: ChevronDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  
  // Technology & Devices
  qrCode: QrCode,
  barcode: Barcode,
  camera: Camera,
  image: Image,
  attachment: Paperclip,
  link: Link,
  
  // Sharing & Printing
  print: Printer,
  share: Share,
  copy: Copy,
  external: ExternalLink,
  refresh: RefreshCw,
  undo: RotateCcw,
  
  // Information & Help
  info: Info,
  help: HelpCircle,
  success: CheckCircle,
  error: XCircle,
  
  // System & Infrastructure
  database: Database,
  server: Server,
  cloud: Cloud,
  online: Wifi,
  offline: WifiOff,
  signal: Signal,
  
  // Layout & Interface
  layout: Layout,
  grid: LayoutGrid,
  list: LayoutList,
  table: Table,
  
  // Controls & Media
  play: PlayCircle,
  pause: PauseCircle,
  stop: StopCircle,
  next: SkipForward,
  previous: SkipBack,
  
  // Audio & Voice
  volume: Volume2,
  mute: VolumeX,
  mic: MicrophoneIcon,
  micOff: MicOff,
  headphones: Headphones,
  
  // Financial & Billing
  billing: CreditCard,
  payment: DollarSign,
  receipt: Receipt,
  wallet: Wallet,
  savings: PiggyBank,
  growth: Growth,
  
  // Logistics & Transport
  delivery: Truck,
  cart: ShoppingCart,
  tag: Tag,
  tags: Tags,
  discount: Percent,
  
  // Location & Movement
  location: MapPin,
  navigation: Navigation,
  transport: Car,
  ambulance: Ambulance,
  home: Home,
  
  // Organization & Structure
  organization: Building2,
  department: Folder,
  team: Users,
  
  // Status & Flags
  flag: Flag,
  bookmark: Bookmark,
  favorite: Star,
  
  // Tools & Utilities
  settings: Settings,
  configure: Cog,
  target: Target,
  focus: Focus,
  crosshair: Crosshair,
  maximize: Maximize,
  minimize: Minimize,
  move: Move
} as const;

// Medical Status Color Mapping
export const StatusColors = {
  normal: "text-green-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  urgent: "text-orange-600",
  critical: "text-red-600",
  error: "text-red-600",
  info: "text-blue-600",
  pending: "text-yellow-600",
  completed: "text-green-600",
  cancelled: "text-gray-600",
  active: "text-green-600",
  inactive: "text-gray-600",
  discontinued: "text-orange-600"
} as const;

// Medical Background Color Mapping
export const StatusBackgrounds = {
  normal: "bg-green-100 text-green-800 border-green-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  urgent: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  error: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  discontinued: "bg-orange-100 text-orange-800 border-orange-200"
} as const;

// Icon Size Mapping for Healthcare UI
export const IconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
  "3xl": "w-12 h-12"
} as const;

// Medical Icon Context Mapping
export const MedicalContext = {
  // Tab Icons
  tabs: {
    overview: MedicalIcons.patient,
    medications: MedicalIcons.medication,
    timeline: MedicalIcons.vitals,
    safety: MedicalIcons.security,
    vitals: MedicalIcons.monitor,
    visit: MedicalIcons.appointment,
    consultation: MedicalIcons.record,
    communication: MedicalIcons.message
  },
  
  // Action Icons
  actions: {
    add: MedicalIcons.add,
    edit: MedicalIcons.edit,
    delete: MedicalIcons.delete,
    save: MedicalIcons.save,
    cancel: MedicalIcons.close,
    confirm: MedicalIcons.confirm,
    print: MedicalIcons.print,
    share: MedicalIcons.share,
    refresh: MedicalIcons.refresh
  },
  
  // Status Icons
  status: {
    active: MedicalIcons.success,
    inactive: MedicalIcons.error,
    pending: MedicalIcons.timer,
    completed: MedicalIcons.verified,
    cancelled: MedicalIcons.close,
    urgent: MedicalIcons.urgent,
    critical: MedicalIcons.critical,
    normal: MedicalIcons.normal
  },
  
  // Medication Icons
  medication: {
    current: MedicalIcons.medication,
    past: MedicalIcons.time,
    repeat: MedicalIcons.refresh,
    summary: MedicalIcons.record,
    verified: MedicalIcons.verified,
    dispense: MedicalIcons.dispense,
    pharmacy: MedicalIcons.pharmacy
  }
} as const;

// Helper function to get icon with consistent styling
export const getMedicalIcon = (
  iconName: keyof typeof MedicalIcons,
  size: keyof typeof IconSizes = "md",
  className?: string
) => {
  const IconComponent = MedicalIcons[iconName];
  const sizeClass = IconSizes[size];
  const finalClassName = className ? `${sizeClass} ${className}` : sizeClass;
  
  return { Icon: IconComponent, className: finalClassName };
};

// Helper function to get status styling
export const getStatusStyling = (status: keyof typeof StatusColors) => ({
  iconColor: StatusColors[status],
  badgeClass: StatusBackgrounds[status]
});

export type MedicalIconName = keyof typeof MedicalIcons;
export type IconSize = keyof typeof IconSizes;
export type StatusType = keyof typeof StatusColors;