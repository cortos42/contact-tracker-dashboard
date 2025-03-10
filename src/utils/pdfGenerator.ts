
import { PropositionData } from "@/types/contact";

/**
 * Generate a PDF from the proposition data and signature
 * 
 * @param propositionData The data for the proposition
 * @param signatureDataURL The signature as a data URL
 * @returns A promise that resolves to the URL of the generated PDF
 */
export const generatePropositionPDF = async (
  propositionData: PropositionData,
  signatureDataURL: string
): Promise<string> => {
  // This is a mock implementation
  // In a real application, we would use a library like jsPDF to generate the PDF
  // or call a backend service to generate it
  
  console.log("Generating PDF with data:", propositionData);
  console.log("Signature data:", signatureDataURL ? "Signature provided" : "No signature");
  
  // Mock PDF generation - in a real app, this would generate an actual PDF
  return new Promise((resolve) => {
    // Simulate PDF generation delay
    setTimeout(() => {
      // Return a mock URL - in a real app, this would be the URL to the generated PDF
      const mockPdfUrl = `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMyAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDEgMCBSIC9MYXN0TW9kaWZpZWQgKEQ6MjAyMzA0MTAxMTI0MzQrMDInMDAnKSAvUmVzb3VyY2VzIDIgMCBSIC9NZWRpYUJveCBbMCAwIDU5NS4yNzU2IDg0MS44ODk4XSAvQ3JvcEJveCBbMCAwIDU5NS4yNzU2IDg0MS44ODk4XSAvQmxlZWRCb3ggWzAgMCA1OTUuMjc1NiA4NDEuODg5OF0gL1RyaW1Cb3ggWzAgMCA1OTUuMjc1NiA4NDEuODg5OF0gL0FydEJveCBbMCAwIDU5NS4yNzU2IDg0MS44ODk4XSAvQ29udGVudHMgNCAwIFIgL1JvdGF0ZSAwIC9Hcm91cCA8PCAvVHlwZSAvR3JvdXAgL1MgL1RyYW5zcGFyZW5jeSAvQ1MgL0RldmljZVJHQiA+PiAvQW5ub3RzIFsgNiAwIFIgXSAvUFogMSA+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggMTc0Pj4gc3RyZWFtCnicZY8xC8MwDITf9St0uEDtRrIcSCGQQIYMXUqWbqGhS8n/h2bLkNDBg/vudCfpzLFR1QGnG1oswak9C6ehnwWCI3hSQZYAYXQbbH2lFmOKw7zu8Iqhd1hKk9MGPL4oz6QcOJ0TXn1IdnvG7Guo6KzRPwpkU1nRZ4vfIJm8Z+SNlGSYCnKu4PP3v9/UKmVoCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAzIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUvWE9iamVjdC9TdWJ0eXBlL0Zvcm0vUmVzb3VyY2VzPDwvUHJvY1NldFsvUERGL1RleHQvSW1hZ2VCL0ltYWdlQy9JbWFnZUldPj4vQkJveFswIDAgMTAwIDEwMF0vRm9ybVR5cGUgMS9NYXRyaXggWzEgMCAwIDEgMCAwXS9MZW5ndGggMTU+PnN0cmVhbQoxIDAgMCAxIDAgMCBjbQplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKPDwvVHlwZS9Bbm5vdC9TdWJ0eXBlL1dpZGdldC9GVCAvU2lnL1QoU2lnbmF0dXJlMSkvUmVjdFswIDAgMCAwXS9WIDEvaS1JRCAxL1BhZ2UgMyAwIFIvQVAgPDwvTiA1IDAgUj4+Pj4KZW5kb2JqCjIgMCBvYmoKPDwgL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldIC9Gb250IDw8IC9GMSAyIDAgUiA+PiAvWE9iamVjdCA8PCAvWDUgNSAwIFIgPj4gPj4KZW5kb2JqCjcgMCBvYmoKPDwgL1Byb2R1Y2VyIChjYWlybyAxLjE2LjAgKGh0dHBzOi8vY2Fpcm9ncmFwaGljcy5vcmcpKSAvQ3JlYXRpb25EYXRlIChEOjIwMjMwNDEwMTEyNDM0KzAyJzAwJykgPj4KZW5kb2JqCjggMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDEgMCBSIC9OYW1lcyA8PCAvRGVzdHMgPDwgL0RlZnMgKG5hbWVzKSA+PiA+PiAvVmlld2VyUHJlZmVyZW5jZXMgPDwgL0RpcmVjdGlvbiAvTDJSID4+ID4+CmVuZG9iagp4cmVmCjAgOQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA1MzEgMDAwMDAgbiAKMDAwMDAwMDg0OSAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyODcgMDAwMDAgbiAKMDAwMDAwMDU5MCAwMDAwMCBuIAowMDAwMDAwNzQyIDAwMDAwIG4gCjAwMDAwMDA5NzEgMDAwMDAgbiAKMDAwMDAwMTA4NyAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDkgL1Jvb3QgOCAwIFIgL0luZm8gNyAwIFIgPj4Kc3RhcnR4cmVmCjEyMDYKJSVFT0YK`;
      
      resolve(mockPdfUrl);
    }, 1000);
  });
};
