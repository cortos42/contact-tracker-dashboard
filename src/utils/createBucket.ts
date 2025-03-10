
import { supabase } from "@/integrations/supabase/client";

export const createDocumentsBucket = async () => {
  // Check if bucket exists first
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === 'documents');
  
  if (!bucketExists) {
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
  } else {
    console.log('Documents bucket already exists');
  }
};
