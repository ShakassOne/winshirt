
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";

// Get cart items
export const getCartItems = async (sessionId: string): Promise<CartItem[]> => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      return [];
    }
    
    // Get cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        color,
        size,
        price,
        customization,
        products:product_id (id, name, image_url, price, description)
      `)
      .eq('cart_session_id', sessionData.id);
      
    if (error) throw error;
    
    // Map to CartItem type
    return cartItems.map(item => ({
      productId: item.products.id,
      name: item.products.name,
      price: parseFloat(item.price as unknown as string),
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      image_url: item.products.image_url,
      customization: item.customization as unknown as CartItem['customization']
    }));
    
  } catch (error) {
    console.error("Error in getCartItems:", error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (sessionId: string) => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      return; // No items to clear
    }
    
    // Delete all items
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_session_id', sessionData.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in clearCart:", error);
    throw error;
  }
};
