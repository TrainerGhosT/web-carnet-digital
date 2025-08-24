
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003';

export interface QrData {
  nombreCompleto: string;
  identificacion: string;
  tipoUsuario: string;
  carrerasOAreas: string[];
  fechaVencimiento: string;
}

export interface QrResponse {
  success: boolean;
  message: string;
  data: {
    qrCode: string;
    format: string;
    identificacion: string;
  };
}

export interface QrError {
  message: string;
  statusCode: number;
}

class QrService {
  private baseURL: string;
  

  constructor() {
    this.baseURL = `${API_BASE_URL}/usuario`;
  }

  /**
   * Genera o obtiene el código QR para un usuario específico
   * @param identificacion - Identificación del usuario
   * @returns Promise con la respuesta del QR
   */
  async generateUserQr(identificacion: string): Promise<QrResponse> {
    try {
      if (!identificacion || identificacion.trim() === '') {
        throw new Error('La identificación del usuario es requerida');
      }

      const response = await axios.get<QrResponse>(
        `${this.baseURL}/qr/${encodeURIComponent(identificacion.trim())}`,
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        
        throw {
          message,
          statusCode: status,
        } as QrError;
      }
      
      throw {
        message: error instanceof Error ? error.message : 'Error desconocido',
        statusCode: 500,
      } as QrError;
    }
  }

  /**
   * Convierte el código QR base64 a una URL de datos
   * @param base64String - String base64 del QR
   * @returns URL de datos para mostrar la imagen
   */
  getQrImageUrl(base64String: string): string {
    return `data:image/png;base64,${base64String}`;
  }

  /**
   * Descarga el código QR como imagen
   * @param base64String - String base64 del QR
   * @param filename - Nombre del archivo (opcional)
   */
  downloadQrImage(base64String: string, filename: string = 'qr-code.png'): void {
    const imageUrl = this.getQrImageUrl(base64String);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const qrService = new QrService();