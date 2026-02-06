import { useState } from "react";
import { toast } from "sonner";

interface ReportData {
  patientName?: string;
  date: Date;
  symptoms: string[];
  predictions: Array<{
    condition: string;
    confidence: number;
    explanation: string;
    severity?: string;
  }>;
  urgencyLevel: string;
  urgencyExplanation: string;
  summary: string;
  recommendations: string[];
}

export const usePdfReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (data: ReportData): Promise<void> => {
    setIsGenerating(true);

    try {
      // Create a printable HTML document
      const reportHtml = generateReportHtml(data);

      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportHtml);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
        }, 500);

        toast.success("Report ready for download");
      } else {
        throw new Error("Unable to open print window");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateReport, isGenerating };
};

function generateReportHtml(data: ReportData): string {
  const urgencyColors: Record<string, string> = {
    emergency: "#ef4444",
    urgent: "#f59e0b",
    consult_soon: "#3b82f6",
    self_care: "#22c55e",
  };

  const urgencyLabels: Record<string, string> = {
    emergency: "Emergency - Seek Immediate Care",
    urgent: "Urgent - See Doctor Today",
    consult_soon: "Consult Soon - Schedule Appointment",
    self_care: "Self-Care - Monitor at Home",
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Aura AI - Health Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0d9488;
    }
    .logo span {
      color: #14b8a6;
    }
    .date {
      color: #6b7280;
      font-size: 14px;
    }
    .disclaimer {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 12px;
      color: #92400e;
      margin-bottom: 24px;
    }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #111827;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .urgency-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      color: white;
      background: ${urgencyColors[data.urgencyLevel] || "#6b7280"};
      margin-bottom: 8px;
    }
    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .prediction {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .prediction-name {
      font-weight: 600;
    }
    .confidence {
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .symptoms-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .symptom-tag {
      background: #e0e7ff;
      color: #3730a3;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
    }
    .recommendations li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .recommendations li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #22c55e;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Diagnova<span>AI</span></div>
    <div class="date">
      Generated: ${data.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
    </div>
  </div>

  <div class="disclaimer">
    ⚠️ <strong>Medical Disclaimer:</strong> This report is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
  </div>

  <div class="section">
    <div class="section-title">🚨 Urgency Assessment</div>
    <div class="urgency-badge">${urgencyLabels[data.urgencyLevel] || data.urgencyLevel}</div>
    <p>${data.urgencyExplanation}</p>
  </div>

  <div class="section">
    <div class="section-title">📋 Reported Symptoms</div>
    <div class="symptoms-list">
      ${data.symptoms.map(s => `<span class="symptom-tag">${s}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">🔍 Possible Conditions</div>
    ${data.predictions.map(p => `
      <div class="prediction">
        <div>
          <div class="prediction-name">${p.condition}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${p.explanation}</div>
        </div>
        <div class="confidence">${Math.round(p.confidence * 100)}%</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">📝 Summary</div>
    <div class="card">
      <p>${data.summary}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">💡 Recommendations</div>
    <ul class="recommendations">
      ${data.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ul>
  </div>

  <div class="footer">
    <p>This report was generated by Aura AI</p>
    <p>For more information, visit diagnova.ai</p>
  </div>
</body>
</html>
  `;
}
