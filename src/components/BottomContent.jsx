import React from 'react';

function FAQItem({ question, answer }) {
    return (
        <div className="glass-card rounded-xl p-5 hover:border-accent/30 transition-all">
            <h3 className="text-lg font-medium text-primary mb-2">{question}</h3>
            <p className="text-secondary text-sm leading-relaxed">{answer}</p>
        </div>
    );
}

function SourceItem({ title, url, description }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-card rounded-xl p-5 hover:border-accent/40 transition-all block"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-accent-pink hover:text-accent-glow transition-colors">{title}</h3>
                <svg className="w-4 h-4 text-muted group-hover:text-accent-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </div>
            <p className="text-secondary text-sm group-hover:text-primary transition-colors">{description}</p>
        </a>
    );
}

export function BottomContent({ faq, sources }) {
    if (!faq && !sources) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 border-t border-element/50 mt-12">
            {/* FAQ Section */}
            {faq && (
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-1 h-8 accent-bar-purple rounded-full"></span>
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-accent">Frequently Asked Questions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faq.map((item, idx) => (
                            <FAQItem key={idx} question={item.question} answer={item.answer} />
                        ))}
                    </div>
                </section>
            )}

            {/* Sources Section */}
            {sources && (
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-1 h-8 accent-bar-green rounded-full"></span>
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-accent-green">Sources & References</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sources.map((item, idx) => (
                            <SourceItem key={idx} title={item.title} url={item.url} description={item.description} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
