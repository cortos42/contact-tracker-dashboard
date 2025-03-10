
import { PropositionData } from "@/types/contact";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

// Logos
const FH_HABITAT_LOGO = "/lovable-uploads/918e25ab-d7a0-4773-ab8a-b045ff819c53.png";
const MAPRIME_LOGO = "/lovable-uploads/fe8b989d-b9ed-40f1-81fe-0ba08e7b63ec.png";

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
  console.log("Generating PDF with data:", propositionData);
  console.log("Signature data:", signatureDataURL ? "Signature provided" : "No signature");
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Set default font
  doc.setFont("helvetica");
  
  // Add header logos and title
  try {
    // FH Habitat logo
    const img = new Image();
    img.src = FH_HABITAT_LOGO;
    await new Promise<void>((resolve) => {
      img.onload = () => {
        doc.addImage(img, 'PNG', 20, 15, 30, 30);
        resolve();
      };
      img.onerror = () => {
        console.error("Error loading FH Habitat logo");
        resolve();
      };
    });

    // MaPrimeRénov logo
    const img2 = new Image();
    img2.src = MAPRIME_LOGO;
    await new Promise<void>((resolve) => {
      img2.onload = () => {
        doc.addImage(img2, 'PNG', 140, 25, 40, 25);
        resolve();
      };
      img2.onerror = () => {
        console.error("Error loading MaPrimeRénov logo");
        resolve();
      };
    });
  } catch (error) {
    console.error("Error adding images:", error);
  }

  // Add FH Habitat text and address
  doc.setTextColor(216, 30, 91); // Pink color
  doc.setFontSize(12);
  doc.text("FH Habitat", 60, 20);
  doc.setFontSize(10);
  doc.text("300 Chemin de la Vézerance", 60, 25);
  doc.text("69560 Ste Colombe", 60, 30);

  // Add document title
  doc.setFontSize(16);
  doc.text("Proposition de travaux de rénovation énergétique", 60, 45);
  doc.setFontSize(12);
  doc.text("Parcours accompagné", 60, 52);

  // Client information section
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(216, 30, 91);
  doc.rect(20, 60, 170, 10, 'F');
  doc.setFontSize(12);
  doc.text("À L'ATTENTION DE :", 25, 67);

  // Client details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text("NOM DU CLIENT :", 25, 77);
  doc.text(propositionData.client.nom, 80, 77);

  doc.text("ADRESSE :", 25, 84);
  doc.text(propositionData.client.adresse, 80, 84);

  doc.text("EMAIL :", 25, 91);
  doc.text(propositionData.client.email, 80, 91);

  doc.text("TÉLÉPHONE :", 120, 91);
  doc.text(propositionData.client.telephone, 150, 91);

  // Description des travaux title
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(20, 20, 40);
  doc.rect(20, 100, 170, 10, 'F');
  doc.setFontSize(12);
  doc.text("DESCRIPTION DES TRAVAUX PROPOSÉS", 25, 107);

  // Isolation sections
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(216, 30, 91);
  
  // Isolation combles
  doc.rect(20, 115, 80, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ISOLATION DES COMBLES", 25, 122);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("• Type de matériau :", 25, 130);
  doc.text(propositionData.travaux.combles.materiau || "", 70, 130);
  doc.text("• Surface :", 25, 138);
  doc.text(propositionData.travaux.combles.surface || "", 70, 138);

  // Isolation sous-rampants
  doc.rect(110, 115, 80, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ISOLATION DES SOUS-RAMPANTS", 115, 122);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("• Type de matériau :", 115, 130);
  doc.text(propositionData.travaux.sousRampants.materiau || "", 160, 130);
  doc.text("• Surface :", 115, 138);
  doc.text(propositionData.travaux.sousRampants.surface || "", 160, 138);

  // Isolation planchers bas
  doc.rect(20, 160, 80, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ISOLATION DES PLANCHERS BAS", 25, 167);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("• Type de matériau :", 25, 175);
  doc.text(propositionData.travaux.planchersBas.materiau || "", 70, 175);
  doc.text("• Surface :", 25, 183);
  doc.text(propositionData.travaux.planchersBas.surface || "", 70, 183);

  // Isolation murs
  doc.rect(110, 160, 80, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("ISOLATION DES MURS DONNANT SUR", 115, 167);
  doc.text("L'EXTÉRIEUR", 115, 174);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("• Méthode :", 115, 182);
  
  // Radio buttons for wall insulation method
  if (propositionData.travaux.murs.methode === "interieur") {
    doc.circle(145, 182, 2, 'FD');
    doc.text("par l'intérieur", 148, 182);
    doc.circle(175, 182, 2, 'D');
    doc.text("par l'extérieur", 178, 182);
  } else {
    doc.circle(145, 182, 2, 'D');
    doc.text("par l'intérieur", 148, 182);
    doc.circle(175, 182, 2, 'FD');
    doc.text("par l'extérieur", 178, 182);
  }
  
  doc.text("• Type de matériau :", 115, 189);
  doc.text(propositionData.travaux.murs.materiau || "", 160, 189);
  doc.text("• Surface :", 115, 196);
  doc.text(propositionData.travaux.murs.surface || "", 160, 196);

  // Chauffage
  doc.rect(20, 205, 80, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("REMPLACEMENT DU MODE DE CHAUFFAGE", 25, 212);
  doc.text("ACTUEL", 25, 219);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Chauffage Actuel :", 25, 227);
  doc.text(propositionData.travaux.chauffage.actuel || "", 70, 227);
  doc.text("Remplacer par :", 25, 235);
  doc.text(propositionData.travaux.chauffage.remplacement || "", 70, 235);

  // Chauffe-eau
  doc.rect(110, 205, 80, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("REMPLACEMENT DU SYSTÈME DE", 115, 212);
  doc.text("CHAUFFE-EAU ACTUEL", 115, 219);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Actuel :", 115, 227);
  doc.text(propositionData.travaux.chauffeEau.actuel || "", 140, 227);
  doc.text("Système proposé", 115, 235);
  doc.text(propositionData.travaux.chauffeEau.propose || "", 140, 235);

  // Ventilation
  doc.rect(20, 250, 170, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("REMPLACEMENT DU SYSTÈME DE VENTILATION ACTUEL", 25, 257);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("• Type de ventilation actuel :", 25, 265);
  doc.text(propositionData.travaux.ventilation.actuel || "", 80, 265);
  doc.text("• Type de ventilation proposé :", 25, 272);
  doc.text(propositionData.travaux.ventilation.propose || "", 80, 272);
  doc.text("• Nombre de bouche :", 120, 265);
  doc.text(propositionData.travaux.ventilation.nombreBouche || "", 160, 265);

  // Add a new page for menuiseries and solar panels
  doc.addPage();
  
  // Add header logos and title again for the second page
  try {
    doc.addImage(FH_HABITAT_LOGO, 'PNG', 20, 15, 30, 30);
    doc.addImage(MAPRIME_LOGO, 'PNG', 140, 25, 40, 25);
  } catch (error) {
    console.error("Error adding images to second page:", error);
  }

  // Add FH Habitat text and address
  doc.setTextColor(216, 30, 91);
  doc.setFontSize(12);
  doc.text("FH Habitat", 60, 20);
  doc.setFontSize(10);
  doc.text("300 Chemin de la Vézerance", 60, 25);
  doc.text("69560 Ste Colombe", 60, 30);

  // Add document title
  doc.setFontSize(16);
  doc.text("Proposition de travaux de rénovation énergétique", 60, 45);
  doc.setFontSize(12);
  doc.text("Parcours accompagné", 60, 52);

  // Menuiseries
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(216, 30, 91);
  doc.rect(20, 60, 170, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("REMPLACEMENT DES MENUISERIES EXTERIEURS", 25, 67);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Matériaux :", 25, 75);
  doc.text(propositionData.travaux.menuiseries.materiau || "", 55, 75);
  doc.text("Couleur :", 120, 75);
  doc.text(propositionData.travaux.menuiseries.couleur || "", 145, 75);

  // Panneaux solaires
  doc.rect(20, 100, 170, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Panneau solaire photovoltaïque", 25, 107);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Marque et modèle onduleur :", 25, 115);
  doc.text(propositionData.travaux.panneauxSolaires.marqueModeleOnduleur || "", 85, 115);
  
  doc.text("Nombre d'onduleur :", 25, 123);
  doc.text(propositionData.travaux.panneauxSolaires.nombreOnduleur || "", 65, 123);
  
  doc.text("Puissance en Kw/c :", 120, 107);
  doc.text(propositionData.travaux.panneauxSolaires.puissance || "", 160, 107);
  
  doc.text("Marque et modèle :", 120, 115);
  doc.text(propositionData.travaux.panneauxSolaires.marqueModele || "", 160, 115);
  
  doc.text("Nombre de panneaux :", 120, 123);
  doc.text(propositionData.travaux.panneauxSolaires.nombrePanneaux || "", 160, 123);

  // Add a third page for financial estimation and signature
  doc.addPage();

  // Add header logos and title again for the third page
  try {
    doc.addImage(FH_HABITAT_LOGO, 'PNG', 20, 15, 30, 30);
    doc.addImage(MAPRIME_LOGO, 'PNG', 140, 25, 40, 25);
  } catch (error) {
    console.error("Error adding images to third page:", error);
  }

  // Add FH Habitat text and address
  doc.setTextColor(216, 30, 91);
  doc.setFontSize(12);
  doc.text("FH Habitat", 60, 20);
  doc.setFontSize(10);
  doc.text("300 Chemin de la Vézerance", 60, 25);
  doc.text("69560 Ste Colombe", 60, 30);

  // Add document title
  doc.setFontSize(16);
  doc.text("Proposition de travaux de rénovation énergétique", 60, 45);
  doc.setFontSize(12);
  doc.text("Parcours accompagné", 60, 52);

  // Estimation financière
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(20, 20, 40);
  doc.rect(20, 60, 170, 10, 'F');
  doc.setFontSize(12);
  doc.text("ESTIMATION FINANCIÈRE", 25, 67);

  // Financial details
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(216, 30, 91);
  doc.rect(20, 75, 170, 30);
  doc.setFontSize(10);
  doc.text("• Coût total des travaux :", 25, 85);
  doc.text(propositionData.financier.coutTotal || "", 75, 85);
  
  doc.text("• Montant des subventions :", 25, 95);
  doc.text(propositionData.financier.montantSubventions || "", 75, 95);
  
  doc.text("• Restant à charge", 120, 85);
  doc.text("client :", 120, 90);
  doc.text(propositionData.financier.restantCharge || "", 150, 85);

  // Engagement client
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(20, 20, 40);
  doc.rect(20, 115, 170, 10, 'F');
  doc.setFontSize(12);
  doc.text("ENGAGEMENT DU CLIENT", 25, 122);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text("En signant ce document, vous vous engagez à : • Valider les travaux : Vous acceptez la réalisation", 25, 132);
  doc.text("des travaux conformément à la description ci- dessus. • Fournir les documents nécessaires : Vous", 25, 137);
  doc.text("vous engagez à fournir tous les documents requis pour la constitution du dossier de subvention. •", 25, 142);
  doc.text("Début de mission de l'accompagnateur : Dès la signature de ce présent document, Mon", 25, 147);
  doc.text("Accompagnateur Rénov' (MAR) sera missionné et débutera sa mission, ce qui engendre des frais.", 25, 152);
  doc.text("En cas de désistement de votre part malgré l'acceptation du dossier par l'ANAH et un accord de", 25, 157);
  doc.text("financement adéquat, le client devra indemniser la société d'un montant de 2 000 euros pour les", 25, 162);
  doc.text("frais engagés.", 25, 167);

  // Conditions
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(20, 20, 40);
  doc.rect(20, 175, 170, 10, 'F');
  doc.setFontSize(12);
  doc.text("CONDITIONS", 25, 182);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text("• Sous réserve d'acceptation du dossier par l'ANAH : La réalisation des travaux dépendra de", 25, 192);
  doc.text("l'acceptation de votre dossier de subvention.", 25, 197);
  doc.text("• Sous réserve d'accord de financement : Les travaux seront engagés sous réserve de l'obtention", 25, 202);
  doc.text("d'un financement adéquat.", 25, 207);

  // Acceptation
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(20, 20, 40);
  doc.rect(20, 215, 170, 10, 'F');
  doc.setFontSize(12);
  doc.text("ACCEPTATION", 25, 222);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text("Pour confirmer votre engagement et votre acceptation des conditions, merci de signer ci-", 25, 232);
  doc.text("dessous :", 25, 237);

  doc.setFontSize(10);
  doc.text("SIGNATURE DU CLIENT :", 25, 247);
  doc.text("Nom du client :", 25, 257);
  doc.text(propositionData.client.nom, 60, 257);
  doc.text("Date :", 25, 267);
  const currentDate = new Date().toLocaleDateString('fr-FR');
  doc.text(currentDate, 40, 267);
  doc.text("Signature :", 120, 267);

  // Add client's signature
  if (signatureDataURL) {
    try {
      doc.addImage(signatureDataURL, 'PNG', 130, 253, 50, 20);
    } catch (error) {
      console.error("Error adding signature:", error);
    }
  }

  // Footer text
  doc.setFontSize(8);
  doc.text("Nous restons à votre disposition pour toute question ou information complémentaire. Ensemble,", 25, 285);
  doc.text("œuvrons pour un habitat plus éco-responsable !", 25, 290);
  doc.text("Cordialement,", 25, 295);

  try {
    doc.addImage(FH_HABITAT_LOGO, 'PNG', 25, 300, 15, 15);
  } catch (error) {
    console.error("Error adding footer logo:", error);
  }

  doc.text("Votre nom :", 45, 300);
  doc.text("Votre fonction :", 45, 305);

  // Add company information at the bottom
  doc.setFontSize(6);
  doc.text("SARL FH CONSTRUCTION BAT au capital de 400 000,00 € | Siège social : 300 Ch de la Vezerance 69560 Sainte-Colombe | Agence : 12", 20, 315);
  doc.text("Place Saint Maurice 38200 Vienne | 09 82 40 84 82 | contact@fhhabitat.fr |www.fh-groupe-habitat.fr", 20, 320);

  // Save the PDF and return as data URL
  const pdfDataUri = doc.output('datauristring');
  return pdfDataUri;
};
