import React, { useState } from 'react';
import { Link2, Loader2, Wand2, AlertCircle } from 'lucide-react';

const LinkImport = ({ onImport }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImport = async () => {
        if (!url) return;
        setLoading(true);
        setError('');

        try {
            // Using allorigins.win for better success rate with simple GET requests
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();

            if (!data.contents) throw new Error("No data found");

            const html = data.contents;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 1. Extract Title
            const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
            const metaTitle = doc.querySelector('title')?.innerText;
            const cleanTitle = (ogTitle || metaTitle || '').split('|')[0].split('-')[0].trim();

            // 2. Extract Image
            const ogImage = doc.querySelector('meta[property="og:image"]')?.content;
            const firstImage = doc.querySelector('img')?.src;
            const image = ogImage || firstImage || '';

            // 3. Extract Price (Difficult, regex heuristic)
            // Look for patterns like ₹1,234 or $12.34
            // We search typical price container areas or just the whole body text if needed
            // Prioritize OG description or price meta tags if they exist
            const ogPriceAmount = doc.querySelector('meta[property="product:price:amount"]')?.content;
            const ogPriceStr = doc.querySelector('meta[property="og:price:amount"]')?.content;

            let price = ogPriceAmount || ogPriceStr || null;

            if (!price) {
                // Regex Fallback
                // Searching specific high-likelihood classes first could be better but generic regex is safer for generic scraping
                // Pattern: Currency Symbol followed by numbers
                const priceRegex = /(?:₹|Rs\.?|USD|\$)\s?[\d,]+(\.\d{2})?/i;
                const bodyText = doc.body.innerText;
                const match = bodyText.match(priceRegex);
                if (match) {
                    price = match[0].replace(/[^\d.]/g, '');
                }
            }

            // Construct result
            const result = {
                name: cleanTitle || '',
                amount: price ? parseFloat(price) : '',
                image: image || null
            };

            if (!result.name) {
                setError("Could not extract details. Try filling manually.");
            } else {
                onImport(result);
                setUrl(''); // Clear input on success
            }

        } catch (err) {
            console.error("Import failed:", err);
            setError("Failed to fetch link. Site might be blocking access.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-500" />
                Auto-fill from Wishlist Link
            </label>
            <div className="flex gap-2">
                <input
                    type="url"
                    placeholder="Paste product URL (Amazon, Flipkart, etc.)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="input flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                />
                <button
                    onClick={handleImport}
                    disabled={loading || !url}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Link2 className="w-5 h-5" />}
                    <span className="hidden sm:inline">Import</span>
                </button>
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
            <p className="text-[10px] text-slate-400 mt-2">
                Works best with public product pages. Some sites may block automated access.
            </p>
        </div>
    );
};

export default LinkImport;
