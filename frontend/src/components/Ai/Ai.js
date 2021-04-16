import React from 'react';
import '../../styles/Ai/Ai.scss';

function AIPage() {
    return (
        <div className="ai-container">
            <h1>AI Feature</h1>
            <h4>Use these algorithms to determine whether the stock is a buy or sell</h4>
            <div className="algorithms">
                <div className="mean">
                    <h2>Mean Reversion</h2>
                    <b>graph</b>
                    <p>description</p>
                </div>
                <div className="momentum">
                    <h2>Momentum Trading</h2>
                    <p>description</p>
                </div>
                <div className="candlesticks">
                    <h2>Japanese Candlesticks</h2>
                    <p>description</p>
                </div>
            </div>
        </div>
    );
}

export default AIPage;
