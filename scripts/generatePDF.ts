import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";

const arrayBufferToBase64 = (buffer: any) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  
export const generatePDF = async (
    reportType: string,
    headers: Array<any>,
    data: any,
    title: string
  ) => {
    try {
      const doc = new jsPDF();
      doc.text(title, 10, 10);
      doc.autoTable({
        head: headers,
        body: data,
      });
  
      const pdfOutput = doc.output("arraybuffer");
      const base64PDF = arrayBufferToBase64(pdfOutput);
      const path = `${FileSystem.documentDirectory}${reportType}-report.pdf`;
  
      await FileSystem.writeAsStringAsync(path, base64PDF, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      Alert.alert("PDF Generated", `${title} has been generated and saved.`);
  
      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Sharing.shareAsync(path);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while generating the PDF.");
      console.error("Error generating PDF: ", error);
    }
  };