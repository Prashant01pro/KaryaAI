import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error || !token) {
            window.location.href = '/login?error=auth_failed';
            return;
        }

        // Save the token to localStorage so axios can send it in future requests
        localStorage.setItem('accessToken', token);

        // Force a full page reload so AuthContext re-runs its checkAuth
        // and fetches the user from /api/v1/auth/me with the new token
        window.location.href = '/dashboard';
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 ai-gradient rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            </div>
            <div className="text-center space-y-2">
                <p className="text-on-surface font-black text-xl tracking-tight">Authenticating...</p>
                <p className="text-on-surface-variant text-sm font-medium">Setting up your session, please wait.</p>
            </div>
            <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
};

export default OAuthCallbackPage;
