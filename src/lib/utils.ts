import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from 'react'; // Keep React import for JSX / createElement
import {
  FileText,
  Image as ImageIcon, // Rename Image to avoid conflict with DOM Image
  Video,
  Music,
  FileArchive, // Added for archives
  Code,        // Added for code
  FileQuestion // Keep default
} from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readFileAsDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URI.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

// Helper function to get file type icon based on MIME type or category name
export function getFileIcon(mimeOrCategory: string): React.ReactNode {
  const commonClass = "w-5 h-5 shrink-0"; // Consistent size and prevent shrinking

  // Prioritize specific MIME types
  if (mimeOrCategory.startsWith('image/')) {
    const iconClassName = `${commonClass} text-accent`;
    // Use React.createElement to avoid potential JSX parsing issues
    return React.createElement(ImageIcon, { className: iconClassName });
  }
  if (mimeOrCategory.startsWith('video/')) {
     const iconClassName = `${commonClass} text-primary`;
    // Use React.createElement
    return React.createElement(Video, { className: iconClassName });
  }
  if (mimeOrCategory.startsWith('audio/')) {
     const iconClassName = `${commonClass} text-secondary-foreground`;
    // Use React.createElement
    return React.createElement(Music, { className: iconClassName });
  }
  if (mimeOrCategory === 'application/pdf' || mimeOrCategory.startsWith('text/plain') || mimeOrCategory.startsWith('application/msword') || mimeOrCategory.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
     const iconClassName = `${commonClass} text-foreground`;
    // Use React.createElement
    return React.createElement(FileText, { className: iconClassName });
  }
  if (mimeOrCategory === 'application/zip' || mimeOrCategory === 'application/x-rar-compressed' || mimeOrCategory === 'application/x-7z-compressed' || mimeOrCategory === 'application/gzip' || mimeOrCategory === 'application/x-tar') {
     const iconClassName = `${commonClass} text-destructive`;
     // Use React.createElement
     return React.createElement(FileArchive, { className: iconClassName });
  }
   // Basic check for common code file types - use text/ or application/ prefixes
  if (mimeOrCategory.startsWith('text/javascript') || mimeOrCategory.startsWith('application/javascript') || mimeOrCategory.startsWith('text/css') || mimeOrCategory.startsWith('text/html') || mimeOrCategory.startsWith('application/json') || mimeOrCategory.startsWith('application/xml') || mimeOrCategory.startsWith('text/x-python') || mimeOrCategory.startsWith('application/x-python-code') || mimeOrCategory.startsWith('text/markdown') || mimeOrCategory.startsWith('text/typescript') || mimeOrCategory.startsWith('application/typescript')) {
     const iconClassName = `${commonClass} text-muted-foreground`;
     // Use React.createElement
     return React.createElement(Code, { className: iconClassName });
  }

  // Fallback to category names if it doesn't look like a standard MIME type
  // (This is a heuristic, might need adjustment based on actual usage)
  if (!mimeOrCategory.includes('/')) {
      switch (mimeOrCategory.toLowerCase()) {
          case 'documents': return React.createElement(FileText, { className: `${commonClass} text-foreground` });
          case 'images': return React.createElement(ImageIcon, { className: `${commonClass} text-accent` });
          case 'videos': return React.createElement(Video, { className: `${commonClass} text-primary` });
          case 'audio': return React.createElement(Music, { className: `${commonClass} text-secondary-foreground` });
          case 'archives': return React.createElement(FileArchive, { className: `${commonClass} text-destructive` });
          case 'code': return React.createElement(Code, { className: `${commonClass} text-muted-foreground` });
          default: return React.createElement(FileQuestion, { className: `${commonClass} text-muted-foreground` });
      }
  }

  // Default icon if no specific type or category matches
  // Use React.createElement
  return React.createElement(FileQuestion, { className: `${commonClass} text-muted-foreground` });
}
