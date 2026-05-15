// Financial Sentiment Analysis Engine
class FinancialSentimentAnalyzer {
    constructor() {
        this.initializeDictionaries();
        this.analysisHistory = [];
        this.sentimentChart = null;
        this.historyChart = null;
    }

    initializeDictionaries() {
        // Positive financial keywords
        this.positiveKeywords = new Set([
            'profit', 'growth', 'gains', 'bull', 'surge', 'rally', 'spike', 'boom',
            'strong', 'excellent', 'outstanding', 'beat', 'surge', 'surge', 'up',
            'increase', 'gain', 'rise', 'advance', 'bullish', 'positive', 'upside',
            'outperform', 'record', 'peak', 'high', 'momentum', 'breakout', 'opportunity',
            'win', 'victory', 'success', 'prosper', 'thrive', 'accelerate', 'expand',
            'recovery', 'rebound', 'uptrend', 'strength', 'powerful', 'innovative',
            'strategic', 'efficient', 'profitable', 'revenue', 'earnings', 'dividends',
            'upgrade', 'outperforming', 'outpaced', 'exceeded', 'surpassed', 'strength',
            'confidence', 'optimistic', 'bullish', 'positive', 'boost', 'improving',
            'impressive', 'robust', 'solid', 'stable', 'consistent', 'reliable'
        ]);

        // Negative financial keywords
        this.negativeKeywords = new Set([
            'loss', 'losses', 'decline', 'down', 'bear', 'crash', 'crash', 'collapse',
            'weak', 'weakness', 'poor', 'miss', 'drop', 'fall', 'falling', 'slump',
            'bearish', 'negative', 'downside', 'underperform', 'deficit', 'debt',
            'bankruptcy', 'recession', 'depression', 'downturn', 'crisis', 'caution',
            'warning', 'risk', 'risks', 'threat', 'threats', 'concern', 'concerns',
            'uncertainty', 'volatile', 'volatility', 'unstable', 'decline', 'downtrend',
            'weakness', 'pessimistic', 'pessimism', 'bearish', 'negative', 'downturn',
            'slowing', 'slowdown', 'contraction', 'recession', 'depression', 'troubled',
            'challenged', 'difficult', 'struggling', 'fail', 'failed', 'failure',
            'mistake', 'error', 'problem', 'problems', 'issue', 'issues', 'concern',
            'concerning', 'alarming', 'disappointment', 'disappointed', 'disappointing',
            'risk', 'risky', 'dangerous', 'volatile', 'uncertain', 'worry', 'worried'
        ]);

        // Neutral financial keywords
        this.neutralKeywords = new Set([
            'stock', 'market', 'trading', 'share', 'price', 'index', 'exchange',
            'investment', 'investor', 'analyst', 'forecast', 'estimate', 'guidance',
            'quarter', 'quarterly', 'annual', 'report', 'earnings', 'revenue', 'cost',
            'expense', 'margin', 'ratio', 'volatility', 'volume', 'sector', 'company',
            'corporate', 'financial', 'economic', 'federal', 'rate', 'interest',
            'inflation', 'deflation', 'currency', 'commodity', 'bond', 'derivative',
            'portfolio', 'hedge', 'futures', 'option', 'warrant', 'equity', 'debt',
            'capital', 'asset', 'liability', 'balance', 'sheet', 'flow', 'cash',
            'transaction', 'deal', 'merger', 'acquisition', 'ipo', 'public',
            'private', 'valuation', 'multiplier', 'multiple', 'performance', 'return',
            'yield', 'dividend', 'split', 'consolidation', 'spinoff', 'subsidiary'
        ]);
    }

    analyzeText(text) {
        const startTime = performance.now();
        
        if (!text.trim()) {
            return null;
        }

        const words = text.toLowerCase().match(/\b[\w'-]+\b/g) || [];
        const uniqueWords = new Set(words);

        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        const detectedPositive = [];
        const detectedNegative = [];
        const detectedNeutral = [];

        // Analyze each word
        uniqueWords.forEach(word => {
            // Clean word
            const cleanWord = word.replace(/[^\w]/g, '');

            if (this.positiveKeywords.has(cleanWord)) {
                positiveCount++;
                detectedPositive.push(word);
            } else if (this.negativeKeywords.has(cleanWord)) {
                negativeCount++;
                detectedNegative.push(word);
            } else if (this.neutralKeywords.has(cleanWord)) {
                neutralCount++;
                detectedNeutral.push(word);
            }
        });

        // Calculate percentages
        const totalSentimentWords = positiveCount + negativeCount + neutralCount;
        const total = positiveCount + negativeCount;

        let sentimentScore = 0;
        let sentimentLabel = 'NEUTRAL';
        let confidence = 0;

        if (total > 0) {
            sentimentScore = (positiveCount - negativeCount) / (positiveCount + negativeCount);
            confidence = Math.min(total / words.length * 100, 100);

            if (sentimentScore > 0.15) {
                sentimentLabel = 'POSITIVE';
            } else if (sentimentScore < -0.15) {
                sentimentLabel = 'NEGATIVE';
            } else {
                sentimentLabel = 'NEUTRAL';
            }
        }

        const endTime = performance.now();

        return {
            text: text,
            sentiment: sentimentLabel,
            score: sentimentScore,
            confidence: Math.round(confidence),
            positiveCount: positiveCount,
            negativeCount: negativeCount,
            neutralCount: neutralCount,
            positive: Math.round((positiveCount / (total || 1)) * 100),
            negative: Math.round((negativeCount / (total || 1)) * 100),
            neutral: Math.round((neutralCount / (total || 1)) * 100),
            detectedPositive: [...new Set(detectedPositive)].slice(0, 10),
            detectedNegative: [...new Set(detectedNegative)].slice(0, 10),
            detectedNeutral: [...new Set(detectedNeutral)].slice(0, 10),
            wordCount: words.length,
            financialTermsCount: positiveCount + negativeCount + neutralCount,
            textLength: text.length,
            analysisTime: Math.round(endTime - startTime)
        };
    }
}

// Initialize analyzer
const analyzer = new FinancialSentimentAnalyzer();

// DOM Elements
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const emptyState = document.getElementById('emptyState');

// Event Listeners
analyzeBtn.addEventListener('click', handleAnalyze);
clearBtn.addEventListener('click', handleClear);
textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        handleAnalyze();
    }
});

function handleAnalyze() {
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Please enter some financial text to analyze.');
        return;
    }

    const result = analyzer.analyzeText(text);
    
    if (result) {
        analyzer.analysisHistory.push({
            sentiment: result.sentiment,
            score: result.score,
            timestamp: new Date().toLocaleTimeString()
        });

        displayResults(result);
    }
}

function handleClear() {
    textInput.value = '';
    resultsSection.style.display = 'none';
    emptyState.style.display = 'block';
}

function displayResults(result) {
    emptyState.style.display = 'none';
    resultsSection.style.display = 'block';

    // Update sentiment label and scores
    const sentimentLabel = document.getElementById('sentimentLabel');
    sentimentLabel.textContent = result.sentiment;
    sentimentLabel.className = `value sentiment-label sentiment-${result.sentiment.toLowerCase()}`;

    document.getElementById('confidenceScore').textContent = `${result.confidence}%`;
    document.getElementById('positiveScore').textContent = `${result.positive}%`;
    document.getElementById('neutralScore').textContent = `${result.neutral}%`;
    document.getElementById('negativeScore').textContent = `${result.negative}%`;

    // Display keywords
    displayKeywords('positiveKeywords', result.detectedPositive, 'positive');
    displayKeywords('negativeKeywords', result.detectedNegative, 'negative');
    displayKeywords('neutralKeywords', result.detectedNeutral, 'neutral');

    // Update analysis details
    document.getElementById('wordCount').textContent = result.wordCount;
    document.getElementById('financialTermsCount').textContent = result.financialTermsCount;
    document.getElementById('textLength').textContent = `${result.textLength} chars`;
    document.getElementById('analysisTime').textContent = `${result.analysisTime}ms`;

    // Update charts
    updateSentimentChart(result);
    updateHistoryChart();
}

function displayKeywords(elementId, keywords, sentiment) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    if (keywords.length === 0) {
        container.innerHTML = '<span class="empty-keyword">No keywords detected</span>';
        return;
    }

    keywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = `keyword-tag ${sentiment}`;
        tag.textContent = keyword;
        container.appendChild(tag);
    });
}

function updateSentimentChart(result) {
    const ctx = document.getElementById('sentimentChart');
    
    if (analyzer.sentimentChart) {
        analyzer.sentimentChart.destroy();
    }

    const colors = {
        'POSITIVE': '#10b981',
        'NEGATIVE': '#ef4444',
        'NEUTRAL': '#6b7280'
    };

    analyzer.sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [result.positive, result.neutral, result.negative],
                backgroundColor: ['#10b981', '#6b7280', '#ef4444'],
                borderColor: ['#059669', '#4b5563', '#dc2626'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        font: { size: 12, weight: 'bold' },
                        padding: 15
                    }
                }
            }
        }
    });
}

function updateHistoryChart() {
    const ctx = document.getElementById('historyChart');
    
    if (analyzer.historyChart) {
        analyzer.historyChart.destroy();
    }

    const labels = analyzer.analysisHistory.map((_, i) => `Analysis ${i + 1}`);
    const scores = analyzer.analysisHistory.map(item => {
        const sentimentValue = item.sentiment === 'POSITIVE' ? 1 : item.sentiment === 'NEGATIVE' ? -1 : 0;
        return sentimentValue * 100;
    });

    const backgroundColors = analyzer.analysisHistory.map(item => {
        switch(item.sentiment) {
            case 'POSITIVE': return '#10b981';
            case 'NEGATIVE': return '#ef4444';
            default: return '#6b7280';
        }
    });

    analyzer.historyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sentiment Score',
                data: scores,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: -100,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Sentiment Score'
                    }
                }
            }
        }
    });
}

// Add sentiment label styling
const style = document.createElement('style');
style.textContent = `
    .sentiment-positive {
        background: rgba(16, 185, 129, 0.3) !important;
        color: #10b981 !important;
        border: 2px solid #10b981 !important;
    }
    
    .sentiment-negative {
        background: rgba(239, 68, 68, 0.3) !important;
        color: #ef4444 !important;
        border: 2px solid #ef4444 !important;
    }
    
    .sentiment-neutral {
        background: rgba(107, 114, 128, 0.3) !important;
        color: #6b7280 !important;
        border: 2px solid #6b7280 !important;
    }
`;
document.head.appendChild(style);

// Initial focus on textarea
textInput.focus();

// Sample text functions
function setSample1() {
    textInput.value = "The company reported exceptional earnings this quarter with strong revenue growth and impressive market performance. Investors showed tremendous confidence, and the stock surged to new record highs on this positive outlook.";
    handleAnalyze();
}

function setSample2() {
    textInput.value = "Disappointing earnings report caused significant losses for shareholders. The company faces mounting debt and faces bankruptcy risk due to declining market share and poor operational performance in a weak economic downturn.";
    handleAnalyze();
}

function setSample3() {
    textInput.value = "The company announced quarterly earnings and reported market performance metrics. The stock price fluctuated as traders analyzed the financial data and investment portfolio allocations in response to market conditions.";
    handleAnalyze();
}

function setSample4() {
    textInput.value = "While the company showed impressive growth in some sectors, it also reported significant losses in others. The outlook remains uncertain with opportunities for recovery but serious risks of further decline if market conditions deteriorate.";
    handleAnalyze();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+1 for sample 1
    if (e.ctrlKey && e.key === '1') setSample1();
    // Ctrl+2 for sample 2
    if (e.ctrlKey && e.key === '2') setSample2();
    // Ctrl+3 for sample 3
    if (e.ctrlKey && e.key === '3') setSample3();
    // Ctrl+4 for sample 4
    if (e.ctrlKey && e.key === '4') setSample4();
});

