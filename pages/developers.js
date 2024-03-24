import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';

export default function Devs() {
    const [mdContent, setMdContent] = useState('');

    useEffect(() => {
        const fetchMdFile = async () => {
          try {
            const response = await fetch('/devs.md'); 
            const text = await response.text();
            setMdContent(text?text:'');
          } catch (error) {
          }
        };
    
        fetchMdFile();
      }, []);
    return (
        <div className="devs page">
            <ReactMarkdown>{mdContent}</ReactMarkdown>
        </div>
    );
}