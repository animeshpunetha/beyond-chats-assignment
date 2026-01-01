import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, Sparkles, FileText, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import API_URL from '../config';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [activeTab, setActiveTab] = useState('enhanced'); // 'original' or 'enhanced'

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/articles/${id}`);
                setArticle(data);
                if (data.status === 'completed' && data.updatedContent) {
                    setActiveTab('enhanced');
                } else {
                    setActiveTab('original');
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };
        fetchArticle();
    }, [id]);

    if (!article) return <div className="p-10 text-center text-slate-500">Loading article...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <nav className="flex items-center text-sm text-slate-500 mb-8">
                <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Home
                </Link>
                <ChevronRight size={16} />
                <span className="truncate max-w-[200px] text-slate-900 font-medium">{article.title}</span>
            </nav>

            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                    {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="bg-slate-100 px-3 py-1 rounded-full font-medium text-slate-700">
                        {new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                    >
                        View Source <ExternalLink size={14} />
                    </a>
                </div>
            </header>

            <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8 w-fit">
                <button
                    className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'original'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('original')}
                >
                    <FileText size={16} />
                    Original
                </button>
                <button
                    className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'enhanced'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('enhanced')}
                    disabled={!article.updatedContent}
                >
                    <Sparkles size={16} className={activeTab === 'enhanced' ? 'fill-indigo-100' : ''} />
                    AI Enhanced
                    {(!article.updatedContent) && <span className="opacity-50 ml-1 text-xs">(N/A)</span>}
                </button>
            </div>

            <main className="bg-white px-8 py-10 md:px-12 md:py-14 rounded-3xl shadow-sm border border-slate-100 min-h-[600px]">
                {activeTab === 'original' ? (
                    <div className="prose prose-slate prose-lg max-w-none hover:prose-a:text-indigo-600">
                        <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                            {article.content}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        <div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-slate-700 prose-li:text-slate-700 mb-12">
                            <ReactMarkdown>{article.updatedContent}</ReactMarkdown>
                        </div>

                        {article.referenceLinks && article.referenceLinks.length > 0 && (
                            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <ExternalLink size={18} className="text-slate-400" />
                                    References & Sources
                                </h3>
                                <ul className="space-y-3">
                                    {article.referenceLinks.map((link, idx) => (
                                        <li key={idx}>
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-600 hover:text-indigo-600 text-sm break-all transition-colors flex items-start gap-2 group"
                                            >
                                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 shrink-0 transition-colors"></span>
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ArticleDetail;
