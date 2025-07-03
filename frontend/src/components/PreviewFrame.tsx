import React, { useEffect, useState } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { WebContainer } from '@webcontainer/api';

const { WritableStream } = window as any;

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState<string>('');
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setUrl(''); // Force iframe reload
    main().then(() => setTimeout(() => setIsRefreshing(false), 800));
  };

  const getViewportDimensions = () => {
    switch (viewportSize) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  async function main() {
    if (!webContainer) return;

    const install = await webContainer.spawn('npm', ['install']);
    await install.exit;

    const dev = await webContainer.spawn('npm', ['run', 'dev']);

    dev.output.pipeTo(
      new WritableStream({
        write(data: Uint8Array) {
          console.log(new TextDecoder().decode(data));
        },
      })
    );

    webContainer.on('server-ready', (_port, readyUrl) => {
      console.log('✅ Server ready at', readyUrl);
      setUrl(readyUrl);
    });
  }

  useEffect(() => {
    main();
  }, [webContainer]);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Controls */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        {/* Viewport Switcher */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-2 rounded transition-colors ${
                viewportSize === 'desktop'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-2 rounded transition-colors ${
                viewportSize === 'tablet'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-2 rounded transition-colors ${
                viewportSize === 'mobile'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm text-gray-400">
            {viewportSize === 'desktop' && 'Desktop'}
            {viewportSize === 'tablet' && 'Tablet (768px)'}
            {viewportSize === 'mobile' && 'Mobile (375px)'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            title="Refresh Preview"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {url && (
            <>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => window.open(url, '_blank')}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview Iframe */}
      <div className="flex-1 bg-gray-800 p-4 overflow-auto">
        {!url ? (
          <div className="text-center text-gray-400 pt-20 animate-pulse">
            <span className="text-sm">Loading preview server...</span>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: getViewportDimensions().width,
                height: getViewportDimensions().height,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                src={url}
                className="w-full h-full border-0"
                title="Live Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
