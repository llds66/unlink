interface Window {
  turnstile: {
    render: (
      container: HTMLElement | string,
      options: {
        sitekey: string
        callback?: (token: string) => void
        "expired-callback"?: () => void
        "error-callback"?: () => void
      }
    ) => string

    reset: (widgetId?: string) => void
  }
}