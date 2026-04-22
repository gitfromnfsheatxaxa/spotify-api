'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, MessageCircle, Share, Link as LinkIcon, Download, ArrowLeft, Music, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ShareData {
  topArtist: string;
  topGenre: string;
  totalArtists: number;
  obsessionScore: number;
}

export default function SharePage() {
  const searchParams = useSearchParams();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse share data on mount
  const parsedData = (() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        return JSON.parse(decodeURIComponent(data));
      } catch (e) {
        console.error('Failed to parse share data');
      }
    }
    return null;
  })();

  useEffect(() => {
    if (parsedData) {
      setShareData(parsedData);
    }
  }, [parsedData]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out my Spotify Stats! 🎵\n\nTop Artist: ${shareData?.topArtist || 'Unknown'}\nTop Genre: ${shareData?.topGenre || 'Unknown'}\n\n#SpotifyStats`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleDownloadImage = () => {
    // Create a simple canvas-based image
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, '#0EA5E9');
      gradient.addColorStop(1, '#38BDF8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);
      
      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 60px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My Spotify Stats', 600, 150);
      
      if (shareData) {
        ctx.font = '40px Inter, sans-serif';
        ctx.fillText(`Top Artist: ${shareData.topArtist || 'Unknown'}`, 600, 250);
        ctx.fillText(`Top Genre: ${shareData.topGenre || 'Unknown'}`, 600, 310);
        ctx.fillText(`Total Artists: ${shareData.totalArtists || 0}`, 600, 370);
      }
      
      // Download
      const link = document.createElement('a');
      link.download = 'spotify-stats.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleInstagramStory = () => {
    // Detect if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Create Instagram Story sized image (9:16 ratio)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, '#0EA5E9');
      gradient.addColorStop(1, '#38BDF8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);
      
      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 80px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('My Spotify Stats', 540, 200);
      
      // Subtitle
      ctx.font = '40px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('Check out my top picks!', 540, 270);
      
      // Stats boxes
      let yPos = 400;
      const boxHeight = 200;
      const boxWidth = 800;
      const boxPadding = 40;
      
      if (shareData) {
        // Top Artist Box
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.roundRect(540 - boxWidth/2, yPos, boxWidth, boxHeight, 30);
        ctx.fill();
        
        ctx.fillStyle = '#0EA5E9';
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillText('🎵 Top Artist', 540, yPos + boxPadding + 60);
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillStyle = '#1F2937';
        ctx.fillText(shareData.topArtist || 'Unknown', 540, yPos + boxPadding + 120);
        
        yPos += boxHeight + 30;
        
        // Top Genre Box
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.roundRect(540 - boxWidth/2, yPos, boxWidth, boxHeight, 30);
        ctx.fill();
        
        ctx.fillStyle = '#0EA5E9';
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillText('✨ Top Genre', 540, yPos + boxPadding + 60);
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillStyle = '#1F2937';
        ctx.fillText(shareData.topGenre || 'Unknown', 540, yPos + boxPadding + 120);
        
        yPos += boxHeight + 30;
        
        // Total Artists Box
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.roundRect(540 - boxWidth/2, yPos, boxWidth, boxHeight, 30);
        ctx.fill();
        
        ctx.fillStyle = '#0EA5E9';
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillText('🎶 Total Artists', 540, yPos + boxPadding + 60);
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillStyle = '#1F2937';
        ctx.fillText(shareData.totalArtists.toString(), 540, yPos + boxPadding + 120);
      }
      
      // Footer with URL
      yPos += boxHeight + 50;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '30px Inter, sans-serif';
      ctx.fillText('Shared with Spotify Stats', 540, yPos);
      
      // Get image data
      const imageData = canvas.toDataURL('image/png');
      
      if (isMobile) {
        // On mobile, try to open Instagram directly
        // First, download the image
        const link = document.createElement('a');
        link.download = 'spotify-stats-story.png';
        link.href = imageData;
        link.click();
        
        // Wait a moment then try to open Instagram
        setTimeout(() => {
          // Try to open Instagram app
          window.location.href = 'instagram://stories';
          
          // Fallback: if Instagram doesn't open, show instructions
          setTimeout(() => {
            const confirmOpen = confirm('Image saved! Tap OK to open Instagram and add to your Story.');
            if (confirmOpen) {
              window.location.href = 'instagram://';
            }
          }, 1000);
        }, 500);
      } else {
        // On desktop, just download and show instructions
        const link = document.createElement('a');
        link.download = 'spotify-stats-story.png';
        link.href = imageData;
        link.click();
        alert('Image downloaded! On your phone, open Instagram and add this image to your Story from your gallery.');
      }
    }
  };

  if (!shareData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-foreground-secondary">Loading share data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/panel"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Stats</span>
          </Link>
          
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            Share Your Stats
          </h1>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card-gradient p-8 mb-8"
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center">
              <Music className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">My Spotify Stats</h2>
            <p className="text-white/70">Shared with Spotify Stats Universe</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <TrendingUp className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{shareData.topArtist || 'N/A'}</p>
              <p className="text-xs text-white/60">Top Artist</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Sparkles className="w-8 h-8 text-neon-pink mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{shareData.topGenre || 'N/A'}</p>
              <p className="text-xs text-white/60">Top Genre</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Music className="w-8 h-8 text-neon-purple mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{shareData.totalArtists || 0}</p>
              <p className="text-xs text-white/60">Total Artists</p>
            </div>
            <div className="glass-card p-4 text-center">
              <TrendingUp className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{shareData.obsessionScore || 0}</p>
              <p className="text-xs text-white/60">Obsession Score</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleShareTwitter}
              className="btn-glass-accent bg-blue-500 hover:bg-blue-600"
            >
              <MessageCircle className="w-4 h-4" />
              Twitter
            </button>
            <button
              onClick={handleShareFacebook}
              className="btn-glass-accent bg-blue-700 hover:bg-blue-800"
            >
              <Share className="w-4 h-4" />
              Facebook
            </button>
            <button
              onClick={handleInstagramStory}
              className="btn-glass-accent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
            >
              <Download className="w-4 h-4" />
              Instagram Story
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-glass-accent bg-purple-500 hover:bg-purple-600"
            >
              <LinkIcon className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleDownloadImage}
              className="btn-glass-accent bg-green-500 hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Scan to View Stats</h3>
          <div className="flex justify-center">
            <div className="glass-card p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>
          <p className="text-sm text-white/60 mt-4">Share this QR code to let others view your stats</p>
        </motion.div>
      </div>
    </div>
  );
}