'use client';

import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram, Link as LinkIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
    url: string;
    title: string;
    layout?: 'vertical' | 'horizontal';
}

export const ShareButtons = ({ url, title, layout = 'horizontal' }: ShareButtonsProps) => {

    const openPopup = (shareUrl: string) => {
        window.open(shareUrl, 'share-dialog', 'width=600,height=400');
    };

    const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'copy') => {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        switch (platform) {
            case 'twitter':
                openPopup(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`);
                break;
            case 'linkedin':
                openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`);
                break;
            case 'facebook':
                openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
                break;
            case 'instagram':
                navigator.clipboard.writeText(url);
                toast.success('Link copied! Open Instagram to paste.');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard');
                break;
        }
    };

    const buttonBase = "w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-100 text-gray-500 shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95";

    // Platform specific hover styles
    const styles = {
        twitter: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]",
        linkedin: "hover:text-[#0A66C2] hover:border-[#0A66C2]",
        facebook: "hover:text-[#1877F2] hover:border-[#1877F2]",
        instagram: "hover:text-[#E4405F] hover:border-[#E4405F]",
        copy: "hover:text-gray-900 hover:border-gray-900"
    };

    return (
        <div className={`flex ${layout === 'vertical' ? 'flex-col items-center' : 'flex-row'} gap-3`}>
            {layout === 'vertical' && (
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2 writing-mode-vertical rotate-180 hidden xl:block">
                    Share
                </div>
            )}

            <button
                onClick={() => handleShare('twitter')}
                className={`${buttonBase} ${styles.twitter}`}
                aria-label="Share on Twitter"
                title="Share on Twitter"
            >
                <Twitter size={20} />
            </button>

            <button
                onClick={() => handleShare('linkedin')}
                className={`${buttonBase} ${styles.linkedin}`}
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
            >
                <Linkedin size={20} />
            </button>

            <button
                onClick={() => handleShare('facebook')}
                className={`${buttonBase} ${styles.facebook}`}
                aria-label="Share on Facebook"
                title="Share on Facebook"
            >
                <Facebook size={20} />
            </button>

            <button
                onClick={() => handleShare('instagram')}
                className={`${buttonBase} ${styles.instagram}`}
                aria-label="Copy link for Instagram"
                title="Copy link for Instagram"
            >
                <Instagram size={20} />
            </button>

            <button
                onClick={() => handleShare('copy')}
                className={`${buttonBase} ${styles.copy}`}
                aria-label="Copy Link"
                title="Copy Link"
            >
                <LinkIcon size={20} />
            </button>
        </div>
    );
};
