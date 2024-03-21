import React from 'react';
import TreeMenu from '../components/TreeMenu';

export default function HomePage() {
    return (
    <div className="home page" style={{overflowY: 'auto', overflowX: 'hidden'}}>
        <TreeMenu />
    </div>
    );
};

