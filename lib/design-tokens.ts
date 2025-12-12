export const designTokens = {
  // Espaciado consistente mobile-first
  spacing: {
    page: 'px-2 py-2 sm:px-4 sm:py-3',
    card: 'p-1.5 sm:p-2',
    cardLg: 'p-2 sm:p-3',
    section: 'space-y-1.5 sm:space-y-2',
    sectionLg: 'space-y-2 sm:space-y-3',
  },

  // Cards y contenedores
  card: {
    base: 'rounded-md border border-border bg-card',
    hover: 'hover:border-primary/50 hover:bg-card/50 transition-all active:scale-95',
    shadow: 'hover:shadow-lg transition-shadow',
  },

  // Tipografía mobile-first
  typography: {
    h1: 'text-sm font-bold text-foreground sm:text-lg',
    h2: 'text-xs font-semibold text-foreground sm:text-base',
    h3: 'text-xs font-semibold uppercase tracking-wider text-muted-foreground',
    body: 'text-xs text-muted-foreground',
    bodyMd: 'text-xs text-foreground sm:text-sm',
    label: 'text-xs font-medium text-foreground',
  },

  // Headers consistentes
  header: {
    container: 'sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80',
    content: 'flex h-14 items-center gap-1.5 px-2 sm:gap-3 sm:px-4',
    title: 'min-w-0 truncate text-sm font-bold text-foreground sm:text-lg',
  },

  // Inputs y forms
  input: {
    base: 'min-h-[40px] text-sm',
    label: 'text-xs font-medium text-foreground',
  },

  // Buttons
  button: {
    sm: 'min-h-[36px] text-xs',
    md: 'min-h-[40px] text-sm',
  },

  // Layouts
  layout: {
    page: 'flex min-h-screen w-full flex-col overflow-x-hidden bg-background',
    main: 'flex-1',
    container: 'mx-auto max-w-lg',
    grid: 'grid gap-1.5 sm:gap-2',
  },

  // Icons
  icon: {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  },
} as const
