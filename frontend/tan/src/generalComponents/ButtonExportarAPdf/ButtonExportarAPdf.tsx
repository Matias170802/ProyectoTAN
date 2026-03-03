import { useState } from 'react';
import Button from '@/generalComponents/Button/Butoon';
import { exportarElementoAPdf } from '@/utils/exportarElementoAPdf';
import { MdPictureAsPdf } from 'react-icons/md';

interface Props {
    targetRef: React.RefObject<HTMLElement | null>;
    fileName: string;
    label?: string;
    className?: string;
    disabled?: boolean;
}

const ButtonExportarAPdf: React.FC<Props> = ({
    targetRef,
    fileName,
    label = 'Exportar a PDF',
    className,
    disabled = false
}) => {
    const [exportando, setExportando] = useState(false);

    const handleExportarPdf = async () => {
        const elemento = targetRef.current;

        if (!elemento || exportando) {
            return;
        }

        setExportando(true);

        try {
            await exportarElementoAPdf(elemento, { fileName });
        } catch (error) {
            console.error('Error al exportar reporte a PDF:', error);
        } finally {
            setExportando(false);
        }
    };

    return (
        <Button
            type='button'
            onClick={handleExportarPdf}
            disabled={disabled || exportando || !targetRef.current}
            label={exportando ? 'Exportando...' : label}
            icon={<MdPictureAsPdf />}
            className={className}
        />
    );
};

export default ButtonExportarAPdf;
