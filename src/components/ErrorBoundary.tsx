import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  message: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: null }

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message || 'Something went wrong.' }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.message) {
      return (
        <div className="app-shell">
          <div className="state-box error" role="alert">
            <h1>Something broke</h1>
            <p>{this.state.message}</p>
            <button
              type="button"
              className="btn"
              onClick={() => this.setState({ message: null })}
            >
              Try to recover
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
