
import { supabase } from "@/integrations/supabase/client";

// Get or create cart session
export const getOrCreateCartSession = async (sessionId: string, guestEmail?: string) => {
  try {
    // Check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('cart_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
      
    if (!fetchError && existingSession) {
      return existingSession;
    }
    
    // Create a new session if doesn't exist
    const { data: newSession, error: insertError } = await supabase
      .from('cart_sessions')
      .insert([
        { 
          session_id: sessionId,
          guest_email: guestEmail,
        }
      ])
      .select()
      .single();
      
    if (insertError) {
      throw insertError;
    }
    
    return newSession;
    
  } catch (error) {
    console.error("Error in getOrCreateCartSession:", error);
    throw error;
  }
};
