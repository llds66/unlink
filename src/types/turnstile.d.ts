interface Window {
  turnstile: {
    render: (
      container: HTMLElement | string,
      options: {
        sitekey: string
        theme?: "light" | "dark",
        size?: "normal" | "flexible" | "compact",
        callback?: (token: string) => void
        "expired-callback"?: () => void
        "error-callback"?: () => void
      }
    ) => string

    reset: (widgetId?: string) => void
  }
}