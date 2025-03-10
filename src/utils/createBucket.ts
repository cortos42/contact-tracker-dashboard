
import { supabase } from "@/integrations/supabase/client";

export const createDocumentsBucket = async () => {
  try {
    console.log('Starting documents bucket check/creation...');
    
    // Check if bucket exists first
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error checking buckets:', bucketsError);
      throw bucketsError;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!bucketExists) {
      console.log('Documents bucket not found. Creating new bucket...');
      const { data, error } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png']
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
      
      console.log('Documents bucket created successfully:', data);
      return true;
    } else {
      console.log('Documents bucket already exists. No action needed.');
      return true;
    }
  } catch (error) {
    console.error('Error in createDocumentsBucket:', error);
    return false;
  }
};
