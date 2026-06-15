import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh',
          background: '#0c0c10', color: '#eeeef5', gap: 16, padding: 24
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,77,109,0.12)', border: '1px solid rgba(255,77,109,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24
          }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Something went wrong</h2>
          <p style={{ color: '#9898b5', fontSize: 13, margin: 0, textAlign: 'center', maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.history.back(); }}
            style={{
              padding: '10px 20px', background: '#7c6aff', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600
            }}
          >
            Go Back
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
