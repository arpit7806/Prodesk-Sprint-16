import { Component } from 'react';

// Wrap anything that fetches or renders unpredictable data:
// <ErrorBoundary label="Task board"><TaskBoard /></ErrorBoundary>
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Swap for real logging (Sentry, etc.) before your CI/CD push
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info);
  }

  handleRetry = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <div className="tm-error-fallback">
          <p>{this.props.label || 'This section'} couldn't load right now.</p>
          <button className="tm-btn" onClick={this.handleRetry} style={{ marginTop: '0.75rem' }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
