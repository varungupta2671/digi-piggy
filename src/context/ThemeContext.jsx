import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('piggy_theme') || 'retro');

    useEffect(() => {
        // Apply theme to body element
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('piggy_theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
