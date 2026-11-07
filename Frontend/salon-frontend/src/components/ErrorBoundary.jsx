import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Uncaught UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center dark:bg-ink-950">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-100 dark:bg-clay-900/40">
            <AlertTriangle className="h-6 w-6 text-clay-600 dark:text-clay-300" />
          </div>
          <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Something snapped</h1>
          <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">The page hit an unexpected error. Reloading usually fixes it.</p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
