import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/articles');
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScrape = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/articles/scrape');
            fetchArticles();
        } catch (error) {
            alert('Scraping failed');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            completed: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            failed: 'bg-red-100 text-red-700 border-red-200',
        };
        const labels = {
            completed: 'Enhanced',
            pending: 'Pending',
            failed: 'Failed',
        };
        const icons = {
            completed: <CheckCircle className="w-3 h-3" />,
            pending: <Clock className="w-3 h-3" />,
            failed: <AlertCircle className="w-3 h-3" />,
        };

        return (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'} flex items-center gap-1`}>
                {icons[status] || <Clock className="w-3 h-3" />}
                {labels[status] || status}
            </span>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        BeyondChats <span className="text-indigo-600">Insights</span>
                    </h1>
                    <p className="text-slate-500 text-lg">Curated articles enhanced by AI.</p>
                </div>
                <button
                    onClick={handleScrape}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                    <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : 'hidden'}`} />
                    {loading ? 'Scraping...' : 'Trigger New Scrape'}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <Link
                        key={article._id}
                        to={`/article/${article._id}`}
                        className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden h-full"
                    >
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                {getStatusBadge(article.status)}
                                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                {article.title}
                            </h2>

                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 mb-4 flex-1">
                                {article.content}
                            </p>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-indigo-50/50 transition-colors">
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 flex items-center gap-1">
                                Read Article <CheckCircle className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {articles.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 mt-10">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-indigo-500 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Articles Found</h3>
                    <p className="text-slate-500 mb-6">Trigger a scrape to fetch the latest insights.</p>
                </div>
            )}
        </div>
    );
};

export default ArticleList;
