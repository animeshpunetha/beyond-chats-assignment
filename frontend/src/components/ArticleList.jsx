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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-green-500" />;
            case 'pending': return <Clock className="text-yellow-500" />;
            case 'failed': return <AlertCircle className="text-red-500" />;
            default: return <Clock className="text-gray-500" />;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">BeyondChats Articles</h1>
                <button
                    onClick={handleScrape}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    Trigger Scrape
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                    <div key={article._id} className="border rounded-xl shadow-sm hover:shadow-md transition bg-white p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold line-clamp-2">{article.title}</h2>
                                {getStatusIcon(article.status)}
                            </div>
                            <p className="text-gray-500 text-sm mb-4">
                                {new Date(article.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 line-clamp-3 mb-4">{article.content}</p>
                        </div>
                        <Link
                            to={`/article/${article._id}`}
                            className="text-blue-600 font-medium hover:underline mt-auto block text-center border-t pt-3"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            {articles.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No articles found. Click "Trigger Scrape" to start.
                </div>
            )}
        </div>
    );
};

export default ArticleList;
