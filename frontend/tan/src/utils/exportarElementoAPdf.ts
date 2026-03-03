import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface ExportarPdfOptions {
    fileName: string;
    paddingMm?: number;
    scale?: number;
    backgroundColor?: string;
}

const normalizarNombreArchivo = (fileName: string) => {
    const baseName = fileName.trim().replace(/\s+/g, '-').toLowerCase();
    return baseName.endsWith('.pdf') ? baseName : `${baseName}.pdf`;
};

export const exportarElementoAPdf = async (
    element: HTMLElement,
    options: ExportarPdfOptions
): Promise<void> => {
    const paddingMm = options.paddingMm ?? 10;

    const canvas = await html2canvas(element, {
        scale: options.scale ?? 2,
        useCORS: true,
        backgroundColor: options.backgroundColor ?? '#ffffff',
        logging: false
    });

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - paddingMm * 2;
    const availableHeight = pageHeight - paddingMm * 2;

    const pageContentHeightPx = Math.floor((availableHeight * canvas.width) / imgWidth);
    let renderedHeightPx = 0;
    let isFirstPage = true;

    while (renderedHeightPx < canvas.height) {
        const sliceHeightPx = Math.min(pageContentHeightPx, canvas.height - renderedHeightPx);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;

        const context = pageCanvas.getContext('2d');
        if (!context) {
            throw new Error('No se pudo generar el contexto de canvas para exportar PDF');
        }

        context.drawImage(
            canvas,
            0,
            renderedHeightPx,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
        );

        const pageImageData = pageCanvas.toDataURL('image/png');
        const sliceHeightMm = (sliceHeightPx * imgWidth) / canvas.width;

        if (!isFirstPage) {
            pdf.addPage();
        }

        pdf.addImage(pageImageData, 'PNG', paddingMm, paddingMm, imgWidth, sliceHeightMm);

        renderedHeightPx += sliceHeightPx;
        isFirstPage = false;
    }

    pdf.save(normalizarNombreArchivo(options.fileName));
};
