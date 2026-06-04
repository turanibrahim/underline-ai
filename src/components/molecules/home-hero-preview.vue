<template>
  <div
    class="relative rounded-lg border border-border/80 bg-card overflow-hidden"
  >
    <div
      class="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3 py-1.5"
    >
      <div class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-full bg-border" />
        <span class="h-2 w-2 rounded-full bg-border" />
        <span class="h-2 w-2 rounded-full bg-border" />
      </div>
      <span class="font-mono text-[10px] text-muted-foreground tracking-tight">
        notes.png &rarr; extract
      </span>
      <span class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
        ok
      </span>
    </div>

    <div class="grid grid-cols-[1fr_auto_1fr] items-stretch">
      <div class="p-4 border-r border-border/60 bg-background/60">
        <p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          input
        </p>
        <div class="space-y-1.5 text-sm leading-relaxed text-foreground/90">
          <p>Reading list, week 3</p>
          <p class="underline decoration-emerald-500 decoration-2 underline-offset-4">
            The Pragmatic Programmer
          </p>
          <p>Chapter notes</p>
          <p class="underline decoration-emerald-500 decoration-2 underline-offset-4">
            invest in your knowledge portfolio
          </p>
          <p>Personal thoughts</p>
          <p class="underline decoration-emerald-500 decoration-2 underline-offset-4">
            DRY is a principle, not a rule
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center px-3 text-muted-foreground">
        <svg
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 7H17M17 7L12 2M17 7L12 12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="p-4 bg-background">
        <p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          output
        </p>
        <ul class="space-y-1.5 text-sm leading-relaxed text-foreground/90">
          <li class="flex gap-2">
            <span class="text-muted-foreground select-none">&bull;</span>
            <span>The Pragmatic Programmer</span>
          </li>
          <li class="flex gap-2">
            <span class="text-muted-foreground select-none">&bull;</span>
            <span>invest in your knowledge portfolio</span>
          </li>
          <li class="flex gap-2">
            <span class="text-muted-foreground select-none">&bull;</span>
            <span>DRY is a principle, not a rule</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
