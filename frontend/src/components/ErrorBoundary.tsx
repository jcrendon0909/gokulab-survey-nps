import { Component, ReactNode } from 'react';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary capturó un error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '1rem', color: '#D61A1F', textAlign: 'center' }}>
          ⚠️ No se pudo cargar el análisis de sentimiento.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;