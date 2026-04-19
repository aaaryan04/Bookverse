import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiX, FiChevronLeft, FiChevronRight, FiBookmark } from 'react-icons/fi';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReader = ({ pdfUrl, bookTitle, onClose, onProgress }) => {
  const { isDark } = useTheme();
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadedPdf = await pdfjs.getDocument(pdfUrl).promise;
        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
      } catch (error) {
        console.error('PDF load error:', error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    const progress = (newPage / totalPages) * 100;
    onProgress?.(newPage, progress);
  };

  const handleAddBookmark = () => {
    setBookmarks([...bookmarks, { page: currentPage, note: '' }]);
  };

  const toggleTheme = () => {
    // Theme will be applied via isDark context
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      {/* Toolbar */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-gray-100 border-gray-200'
        }`}
      >
        <div>
          <h3 className="text-lg font-bold">{bookTitle}</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'hover:bg-slate-700'
                  : 'hover:bg-gray-200'
              }`}
              disabled={currentPage === 1}
            >
              <FiChevronLeft size={20} />
            </button>

            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              className={`w-16 px-2 py-1 border rounded text-center ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
            />

            <button
              onClick={() => goToPage(currentPage + 1)}
              className={`p-2 rounded-lg transition ${
                isDark
                  ? 'hover:bg-slate-700'
                  : 'hover:bg-gray-200'
              }`}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          {/* Zoom */}
          <select
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className={`px-3 py-1 border rounded ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-white'
                : 'bg-white border-gray-300'
            }`}
          >
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
            <option value={1.25}>125%</option>
            <option value={1.5}>150%</option>
          </select>

          {/* Bookmark */}
          <button
            onClick={handleAddBookmark}
            className={`p-2 rounded-lg transition ${
              isDark
                ? 'hover:bg-slate-700'
                : 'hover:bg-gray-200'
            }`}
          >
            <FiBookmark size={20} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {pdf ? (
          <PDFPage pdf={pdf} pageNum={currentPage} scale={scale} />
        ) : (
          <div className="text-center">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading PDF...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PDFPage = ({ pdf, pageNum, scale }) => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const renderPage = async () => {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    };

    renderPage();
  }, [pdf, pageNum, scale]);

  return <canvas ref={canvasRef} />;
};

export default PDFReader;
