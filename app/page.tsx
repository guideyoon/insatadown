'use client';

import { useState } from 'react';
import { Copy, Download, Instagram, Loader2, Check } from 'lucide-react';
import clsx from 'clsx';

interface ScrapeResult {
    media: string[];
    raw: any;
}

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScrapeResult | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleExtract = async () => {
        if (!url) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to extract post');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCaption = () => {
        const caption = result?.raw?.post_info?.caption || result?.raw?.caption || result?.raw?.graphql?.shortcode_media?.edge_media_to_caption?.edges?.[0]?.node?.text || '';

        if (caption) {
            navigator.clipboard.writeText(caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getCaption = () => {
        return result?.raw?.post_info?.caption || result?.raw?.caption || result?.raw?.graphql?.shortcode_media?.edge_media_to_caption?.edges?.[0]?.node?.text || 'No caption found';
    }

    const handleDownloadAll = async () => {
        if (!result?.media.length) return;

        for (let i = 0; i < result.media.length; i++) {
            const imgUrl = result.media[i];
            const link = document.createElement('a');
            link.href = `/api/proxy?url=${encodeURIComponent(imgUrl)}`;
            link.download = `instagram-post-${i + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Add delay to prevent browser blocking multiple downloads
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 font-sans selection:bg-pink-500 selection:text-white">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 pt-10">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-2xl shadow-lg mb-4">
                        <Instagram className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500">
                        InstaSaver
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Download Instagram photos & copy captions instantly.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-neutral-900/50 border border-neutral-800 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl backdrop-blur-sm">
                    <input
                        type="text"
                        placeholder="Paste Instagram URL here..."
                        className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-neutral-600 text-lg"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                    />
                    <button
                        onClick={handleExtract}
                        disabled={loading || !url}
                        className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Working...</span>
                            </>
                        ) : (
                            <span>Extract</span>
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Caption Section */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50">
                                <h3 className="font-semibold text-neutral-300">Caption</h3>
                                <button
                                    onClick={handleCopyCaption}
                                    className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy Text'}
                                </button>
                            </div>
                            <div className="p-4 bg-neutral-950/50">
                                <pre className="whitespace-pre-wrap text-neutral-300 font-mono text-sm leading-relaxed max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                                    {getCaption()}
                                </pre>
                            </div>
                        </div>

                        {/* Media Grid */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="font-semibold text-neutral-300">
                                    Found {result.media.length} Image{result.media.length !== 1 ? 's' : ''}
                                </h3>
                                {result.media.length > 1 && (
                                    <button
                                        onClick={handleDownloadAll}
                                        className="text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download All
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.media.map((imgUrl, idx) => (
                                    <div key={idx} className="group relative aspect-square bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`/api/proxy?url=${encodeURIComponent(imgUrl)}`}
                                            alt={`Instagram post ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <a
                                                href={`/api/proxy?url=${encodeURIComponent(imgUrl)}`}
                                                download
                                                className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
