import { useState } from 'react';
import {
  Folder,
  File as FileIcon,
  ChevronRight,
  ChevronDown,
  Code,
  Image,
  FileText,
  Settings,
  Palette,
  Plus,
  Download
} from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  selectedPath: string | null;
}

function getFileIcon(fileName: string, type: string) {
  if (type === 'folder') return Folder;

  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': return Code;
    case 'css': return Palette;
    case 'js': return Code;
    case 'json': return Settings;
    case 'md': return FileText;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'ico': return Image;
    default: return FileIcon;
  }
}

function FileNode({ item, depth, onFileClick, selectedPath }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedPath === item.path;

  const Icon = getFileIcon(item.name, item.type);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 rounded cursor-pointer transition-all
          ${isSelected ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50' : 'text-gray-300 hover:bg-gray-700'}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="mr-1">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        <Icon className={`w-4 h-4 mr-2 ${item.type === 'folder' ? 'text-blue-400' : 'text-gray-400'}`} />
        <span className="text-sm">{item.name}</span>
      </div>

      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child, idx) => (
            <FileNode
              key={`${child.path}-${idx}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const handleFileClick = (file: FileItem) => {
    setSelectedFilePath(file.path);
    onFileSelect(file);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg h-full flex flex-col border border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-white">File Explorer</h2>
        <div className="flex space-x-2">
          <button className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={handleFileClick}
            selectedPath={selectedFilePath}
          />
        ))}
      </div>
    </div>
  );
}
