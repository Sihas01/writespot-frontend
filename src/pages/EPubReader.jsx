import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import axios from 'axios';
import { IoArrowBack, IoSettingsOutline, IoClose } from 'react-icons/io5';

const THEMES = {
    normal: { name: 'Normal', bg: '#FFFFFF', text: '#000000' },
    dark: { name: 'Dark', bg: '#1A1A1A', text: '#FFFFFF' },
    coffee: { name: 'Coffee', bg: '#F4ECD8', text: '#5B4636' }
};

const FONT_SIZES = [
    { label: 'Small', value: '18px' },
    { label: 'Medium', value: '24px' },
    { label: 'Large', value: '34px' }
];

const EPubReader = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('normal');
    const [fontSize, setFontSize] = useState('24px');
    const [showSettings, setShowSettings] = useState(false);

    const renditionRef = useRef(null);
    const themeRef = useRef(theme);
    const fontSizeRef = useRef(fontSize);
    const readerContainerRef = useRef(null);

    const injectStyles = (contents) => {
        const themeObj = THEMES[themeRef.current];
        const size = fontSizeRef.current;
        const doc = contents.document;

        if (!doc.querySelector('#noto-sans-font')) {
            const link = doc.createElement("link");
            link.id = 'noto-sans-font';
            link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&display=swap";
            link.rel = "stylesheet";
            doc.head.appendChild(link);
        }

        contents.addStylesheetRules({
            'body': {
                'background-color': 'transparent !important',
                'color': `${themeObj.text} !important`,
                'font-family': '"Noto Sans Sinhala", sans-serif !important',
                'font-size': `${size} !important`,
                'line-height': '2.2 !important',
                'text-align': 'left !important',
                'padding': '20px 40px !important',
                'margin': '0 !important',
                'overflow-x': 'hidden !important',
                '-ms-overflow-style': 'none !important',
                'scrollbar-width': 'none !important'
            },
            'html': {
                'overflow-x': 'hidden !important',
                '-ms-overflow-style': 'none !important',
                'scrollbar-width': 'none !important'
            },
            // Forcefully hide scrollbar in Chrome/Safari/Edge
            '::-webkit-scrollbar': {
                'display': 'none !important',
                'width': '0 !important',
                'height': '0 !important'
            },
            'h1, h2, h3, .title, .chapter-title': {
                'text-align': 'left !important',
                'margin-bottom': '1.5em !important',
                'line-height': '1.4 !important',
                'display': 'block !important'
            },
            'p': {
                'margin-bottom': '1.5em !important',
                'width': '100% !important',
                'max-width': '100% !important',
                'overflow-wrap': 'break-word !important'
            }
        });
    };

    useEffect(() => {
        themeRef.current = theme;
        fontSizeRef.current = fontSize;
        const applyTheme = () => {
            if (renditionRef.current) {
                const contentsList = renditionRef.current.getContents();
                contentsList?.forEach(contents => injectStyles(contents));
            }
            if (readerContainerRef.current) {
                const allElements = readerContainerRef.current.querySelectorAll('div, iframe');
                allElements.forEach(el => {
                    el.style.setProperty('background-color', THEMES[theme].bg, 'important');
                    el.style.setProperty('overflow-x', 'hidden', 'important');
                    el.style.setProperty('scrollbar-width', 'none', 'important');
                });
            }
        };
        applyTheme();
        const timer = setTimeout(applyTheme, 300);
        return () => clearTimeout(timer);
    }, [theme, fontSize]);

    const saveTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/books/${bookId}/reader`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookData(res.data);
                if (res.data.readingProgress?.cfi) {
                    setLocation(res.data.readingProgress.cfi);
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchBookData();
    }, [bookId]);

    const handleLocationChange = (loc) => {
        setLocation(loc);

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                // Calculate percentage if possible, or just send CFI
                // React-reader creates cfi, percentage is hard to get without rendition
                // We'll trust the backend to handle it or just send CFI
                await axios.put(
                    `${import.meta.env.VITE_API_URL}/books/${bookId}/progress`,
                    { cfi: loc, percentage: 0 }, // TODO: Calculate percentage
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Failed to save progress", error);
            }
        }, 1000); // Save after 1 second of no changes
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white">Loading...</div>;

    const currentTheme = THEMES[theme];

    return (
        <div className="flex h-screen flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: currentTheme.bg }}>
            {/* Header */}
            <div className="z-20 flex items-center justify-between border-b px-6 py-4"
                style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderColor: theme === 'dark' ? '#333' : '#eee' }}>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-black/5 rounded-full"><IoArrowBack size={24} /></button>
                    <span className="font-semibold">{bookData.title}</span>
                </div>
                <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:bg-black/5 rounded-full"><IoSettingsOutline size={24} /></button>
            </div>

            {/* Reader Container */}
            <div ref={readerContainerRef} className="relative flex-1 flex justify-center overflow-hidden">
                <div className="w-full max-w-4xl h-full overflow-hidden">
                    <ReactReader
                        url={bookData.epubUrl}
                        location={location}
                        locationChanged={handleLocationChange}
                        getRendition={(rendition) => {
                            renditionRef.current = rendition;
                            rendition.hooks.content.register(injectStyles);
                        }}
                        styles={{
                            container: { background: 'transparent' },
                            reader: { background: 'transparent' },
                            viewer: {
                                background: 'transparent',
                                overflowX: 'hidden'
                            }
                        }}
                        epubOptions={{
                            flow: "scrolled",
                            manager: "default",
                        }}
                    />
                </div>
            </div>

            {/* Settings Menu */}
            {showSettings && (
                <div className="absolute right-6 top-20 z-50 w-72 rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
                    <div className="mb-6 flex justify-between items-center border-b pb-2">
                        <span className="font-bold text-gray-800">Reading Settings</span>
                        <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><IoClose size={24} /></button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-widest">Theme</p>
                            <div className="flex gap-3">
                                {Object.keys(THEMES).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`h-12 flex-1 rounded-xl border-2 transition-all ${theme === t ? 'border-blue-500 scale-105 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                                        style={{ backgroundColor: THEMES[t].bg }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-widest">Text Size</p>
                            <div className="flex rounded-xl bg-gray-100 p-1">
                                {FONT_SIZES.map(s => (
                                    <button
                                        key={s.value}
                                        onClick={() => setFontSize(s.value)}
                                        className={`flex-1 py-2 text-sm rounded-lg transition-all ${fontSize === s.value ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EPubReader;