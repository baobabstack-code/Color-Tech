'use client';

import React, { Component, ReactNode } from 'react';

interface MobileDetectionBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface MobileDetectionBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class MobileDetectionBoundary extends Component<
    MobileDetectionBoundaryProps,
    MobileDetectionBoundaryState
> {
    constructor(props: MobileDetectionBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): MobileDetectionBoundaryState {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Only log mobile detection related errors to avoid noise, but specifically ignore "Unknown action: is-mobile"
        if (error.message === 'Unknown action: is-mobile') {
            // This specific error is expected and handled by the boundary, so we don't need to warn
            return;
        }

        if (error.message.includes('mobile') || error.message.includes('is-mobile')) {
            console.warn('Mobile detection error caught:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI for mobile detection errors
            return this.props.fallback || (
                <div className="mobile-detection-fallback">
                    {this.props.children}
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for wrapping components that use mobile detection
export function withMobileDetectionBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WrappedComponent(props: P) {
        return (
            <MobileDetectionBoundary fallback={fallback}>
                <Component {...props} />
            </MobileDetectionBoundary>
        );
    };
}
