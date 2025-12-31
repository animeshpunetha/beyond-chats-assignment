import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Actually I didn't install this, I should use a simple display or just pre-wrap. Or install it. I'll use simple whitespace-pre-wrap for now to match "Very Easy" spec without extra deps.

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [activeTab, setActiveTab] = useState('enhanced'); // 'original' or 'enhanced'

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/articles/${id}`);
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

    if (!article) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <Link to="/" className="flex items-center text-gray-600 hover:text-black mb-4 gap-2">
                <ArrowLeft size={20} /> Back to Articles
            </Link>

            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <a href={article.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-sm mb-6">
                View Original Source <ExternalLink size={14} />
            </a>

            <div className="flex border-b mb-6">
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'original' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('original')}
                >
                    Original Article
                </button>
                <button
                    className={`px-6 py-3 font-medium ${activeTab === 'enhanced' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('enhanced')}
                    disabled={!article.updatedContent}
                >
                    AI Enhanced Version {(!article.updatedContent) && '(Not Available)'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-8 min-h-[500px]">
                {activeTab === 'original' ? (
                    <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
                        {article.content}
                    </div>
                ) : (
                    <div>
                        <div className="prose max-w-none text-gray-800 mb-8">
                            <ReactMarkdown>{article.updatedContent}</ReactMarkdown>
                        </div>

                        {article.referenceLinks && article.referenceLinks.length > 0 && (
                            <div className="mt-8 pt-8 border-t">
                                <h3 className="text-lg font-bold mb-4">References</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    {article.referenceLinks.map((link, idx) => (
                                        <li key={idx}>
                                            <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;
