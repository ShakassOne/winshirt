
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";
import { getOrCreateCartSession } from "./cartSession.service";

// Add item to cart
export const addToCart = async (sessionId: string, item: CartItem) => {
  try {
    // Get or create cart session
    const cartSession = await getOrCreateCartSession(sessionId);
    
    // Check if item already exists in cart
    const { data: existingItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_session_id', cartSession.id)
      .eq('product_id', item.productId)
      .single();
    
    if (!fetchError && existingItem) {
      // Update quantity if item exists
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + item.quantity,
          customization: item.customization || existingItem.customization,
          color: item.color || existingItem.color,
          size: item.size || existingItem.size
        })
        .eq('id', existingItem.id);
        
      if (updateError) throw updateError;
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_session_id: cartSession.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
            customization: item.customization
          }
        ]);
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (sessionId: string, productId: string) => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      throw new Error("Cart session not found");
    }
    
    // Find the cart item
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_session_id', sessionData.id)
      .eq('product_id', productId)
      .single();
      
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    
    // Delete the item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItem.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (sessionId: string, productId: string, quantity: number) => {
  try {
    // Get cart session
    const { data: sessionData } = await supabase
      .from('cart_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
      
    if (!sessionData) {
      throw new Error("Cart session not found");
    }
    
    // Find the cart item
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('id')
      .eq('cart_session_id', sessionData.id)
      .eq('product_id', productId)
      .single();
      
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    
    // Update the quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItem.id);
      
    if (error) throw error;
    
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    throw error;
  }
};
