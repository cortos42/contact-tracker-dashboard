
import { supabase } from "@/integrations/supabase/client";

export const createDocumentsBucket = async () => {
  try {
    // Vérifier si le bucket existe
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Erreur lors de la vérification des buckets:', bucketError);
      throw bucketError;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!bucketExists) {
      // Si le bucket n'existe pas, on le crée
      const { data, error } = await supabase.storage.createBucket('documents', {
        public: false, // Bucket privé avec accès contrôlé par les politiques RLS
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png']
      });
      
      if (error) {
        console.error('Erreur lors de la création du bucket:', error);
        throw error;
      }
      
      console.log('Bucket "documents" créé avec succès:', data);
    } else {
      console.log('Le bucket "documents" existe déjà');
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du bucket documents:', error);
    return false;
  }
};
