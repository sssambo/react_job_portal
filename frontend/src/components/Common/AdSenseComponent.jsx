import React, { useEffect } from 'react';

const AdSenseComponent = ({ slot, format = 'auto', responsive = 'true', style = {} }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx';

    return (
        <div className="ad-container" style={{ margin: '20px 0', textAlign: 'center', overflow: 'hidden', ...style }}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={clientId}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}></ins>
        </div>
    );
};

export default AdSenseComponent;
