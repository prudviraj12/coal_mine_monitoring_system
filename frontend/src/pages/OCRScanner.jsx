import React, { useState, useEffect } from 'react';
import { processOCR, fetchOCRHistory } from '../services/api';
import { FileScan, Upload, CheckCircle2, FileText, Sparkles, Database, ArrowRight, Eye } from 'lucide-react';

export default function OCRScanner() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);

  const [docType, setDocType] = useState('DGMS Statutory Register');
  const [fileName, setFileName] = useState('DGMS_Form_IV_Safety_Register_Sept2026.pdf');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchOCRHistory();
      setHistory(data);
      if (data && data.length > 0) {
        setActiveDoc(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSimulatedUpload = async () => {
    setProcessing(true);
    try {
      const result = await processOCR({
        filename: fileName,
        doc_type: docType,
        uploaded_by: 'Rajesh Kumar (Supervisor)'
      });
      setActiveDoc(result);
      await loadHistory();
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <FileScan className="w-4 h-4 text-blue-600" />
            <span>AI Document Digitization & Paperless Governance</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">OCR Document & Legacy File Scanner</h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Automatically extracts structured compliance telemetries from scanned paper registers and legacy Excel logbooks
          </p>
        </div>
      </div>

      {/* Main Grid: Upload Simulator + Extracted Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Scanner Controls */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Upload Scanned Document or Excel File
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value="DGMS Statutory Register">DGMS Statutory Register (Form IV / CMR 2017)</option>
                <option value="MoEFCC Environmental Return">MoEFCC Environmental Return (Air & Water Log)</option>
                <option value="Contractor Attendance Sheet">Contractor Worker Form B Attendance Register</option>
                <option value="Legacy Excel Production Log">Legacy Excel Production & Shift Tonnage Log</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Select File</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Interactive Drag Drop Zone */}
          <div
            onClick={handleSimulatedUpload}
            className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-2xl bg-slate-50 hover:bg-slate-100 transition flex flex-col items-center justify-center cursor-pointer space-y-2 group"
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition">
              <FileScan className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold text-slate-900">Click to Simulate AI OCR Document Scanning</p>
            <p className="text-[11px] text-slate-500 font-medium">Supports PDF, PNG, JPG, and XLSX formats</p>
          </div>

          <button
            onClick={handleSimulatedUpload}
            disabled={processing}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-amber-400 ${processing ? 'animate-spin' : ''}`} />
            {processing ? 'Extracting Text via Tesseract OCR...' : 'Run AI OCR Digitization'}
          </button>
        </div>

        {/* Extracted JSON / DB Preview Panel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Extracted Structured Data</h3>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                AI Confidence: 96.8%
              </span>
            </div>

            {activeDoc ? (
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 font-bold">Document Title:</span>
                  <span className="text-slate-900 font-bold">{activeDoc.filename}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] space-y-1.5 overflow-x-auto shadow-xs">
                  <p className="text-slate-400 text-[10px] font-sans font-bold mb-1">STRUCTURAL FIELD EXTRACTION (JSON):</p>
                  {typeof activeDoc.extracted_data === 'string' ? (
                    <pre className="whitespace-pre-wrap">{activeDoc.extracted_data}</pre>
                  ) : (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(activeDoc.extracted_data, null, 2)}</pre>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data verified and synced directly to PostgreSQL compliance database table!</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center font-medium">No document scanned yet.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 text-center text-slate-500 text-[11px] font-medium">
            Eliminating paper clutter across Indian coal mines
          </div>
        </div>
      </div>
    </div>
  );
}
