
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchProductById, fetchAllDesigns, fetchAllMockupColors, fetchAllLotteries } from '@/services/api.service';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Star, Palette, Shirt, Gift } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedDesign, setSelectedDesign] = useState<string>('none');
  const [selectedDesignFront, setSelectedDesignFront] = useState<string | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<string | null>(null);
  const [selectedLottery, setSelectedLottery] = useState<string>('none');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: designs } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns,
  });

  const { data: mockupColors } = useQuery({
    queryKey: ['mockupColors'],
    queryFn: fetchAllMockupColors,
  });

  const { data: lotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  const activeLotteries = lotteries?.filter(lottery => lottery.is_active) || [];

  useEffect(() => {
    if (product && mockupColors) {
      const availableColors = mockupColors.filter(color => 
        color.product_category === product.category
      );
      if (availableColors.length > 0) {
        setSelectedColor(availableColors[0].color_name);
      }
    }
  }, [product, mockupColors]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(
        product.id,
        quantity,
        selectedColor,
        selectedSize,
        selectedDesignFront,
        selectedDesignBack,
        selectedLottery !== 'none' ? selectedLottery : null
      );
      
      toast.success(`${product.name} ajouté au panier !`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  if (productLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Chargement du produit...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Produit non trouvé ou une erreur est survenue.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const availableColors = mockupColors?.filter(color => 
    color.product_category === product.category
  ) || [];

  const availableDesigns = designs?.filter(design => 
    design.product_category === product.category
  ) || [];

  const selectedColorData = availableColors.find(color => color.color_name === selectedColor);
  const displayImage = selectedColorData?.image_url || product.image_url;

  const formattedPrice = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(product.price);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image du produit */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10">
                <img 
                  src={displayImage} 
                  alt={product.name}
                  className="w-full h-full object-contain p-8" 
                />
              </div>
            </div>

            {/* Détails du produit */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-winshirt-purple/20 text-winshirt-purple">
                    {product.category}
                  </Badge>
                  {product.is_customizable && (
                    <Badge variant="outline" className="border-winshirt-blue text-winshirt-blue">
                      <Palette className="w-3 h-3 mr-1" />
                      Personnalisable
                    </Badge>
                  )}
                  {product.tickets_offered > 0 && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      <Gift className="w-3 h-3 mr-1" />
                      {product.tickets_offered} tickets
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-white/60">(42 avis)</span>
                </div>
                <p className="text-4xl font-bold text-winshirt-purple mb-6">{formattedPrice}</p>
              </div>

              <div className="space-y-6">
                {/* Couleur */}
                {availableColors.length > 0 && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">Couleur: <span className="text-winshirt-blue">{selectedColor}</span></Label>
                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-3">
                      {availableColors.map((color) => (
                        <div key={color.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={color.color_name} id={color.color_name} className="sr-only" />
                          <Label
                            htmlFor={color.color_name}
                            className={`w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                              selectedColor === color.color_name 
                                ? 'border-winshirt-purple ring-2 ring-winshirt-purple/50' 
                                : 'border-white/20 hover:border-white/40'
                            }`}
                            style={{ backgroundColor: color.hex_code }}
                            title={color.color_name}
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Taille */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Taille:</Label>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <RadioGroupItem value={size} id={size} className="sr-only" />
                        <Label
                          htmlFor={size}
                          className={`px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                            selectedSize === size
                              ? 'border-winshirt-purple bg-winshirt-purple text-white'
                              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                          }`}
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Personnalisation */}
                {product.is_customizable && availableDesigns.length > 0 && (
                  <GlassCard className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shirt className="w-5 h-5 text-winshirt-purple" />
                      <h3 className="text-lg font-semibold">Personnaliser ce produit</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Design avant:</Label>
                        <Select value={selectedDesignFront || 'none'} onValueChange={(value) => setSelectedDesignFront(value === 'none' ? null : value)}>
                          <SelectTrigger className="bg-white/5 border-white/20">
                            <SelectValue placeholder="Choisir un design" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun design</SelectItem>
                            {availableDesigns.map((design) => (
                              <SelectItem key={design.id} value={design.id}>{design.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Design arrière:</Label>
                        <Select value={selectedDesignBack || 'none'} onValueChange={(value) => setSelectedDesignBack(value === 'none' ? null : value)}>
                          <SelectTrigger className="bg-white/5 border-white/20">
                            <SelectValue placeholder="Choisir un design" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun design</SelectItem>
                            {availableDesigns.map((design) => (
                              <SelectItem key={design.id} value={design.id}>{design.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Participation à une loterie */}
                {product.tickets_offered > 0 && activeLotteries.length > 0 && (
                  <GlassCard className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="w-5 h-5 text-winshirt-blue" />
                      <h3 className="text-lg font-semibold">Participer à 1 loterie</h3>
                    </div>
                    <p className="text-sm text-white/70 mb-4">
                      Ce produit vous permet de participer à 1 loterie. Sélectionnez celle qui vous intéresse.
                    </p>
                    
                    <Select value={selectedLottery} onValueChange={setSelectedLottery}>
                      <SelectTrigger className="bg-white/5 border-white/20">
                        <SelectValue placeholder="Choisir une loterie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ne pas participer</SelectItem>
                        {activeLotteries.map((lottery) => (
                          <SelectItem key={lottery.id} value={lottery.id}>
                            {lottery.title} - {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(lottery.value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </GlassCard>
                )}

                {/* Quantité et ajout au panier */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Quantité:</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 border-white/20 hover:bg-white/10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-10 w-10 border-white/20 hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 text-white py-3 text-lg font-semibold"
                  >
                    Ajouter au panier
                  </Button>
                </div>
              </div>

              {/* Description */}
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-white/70 leading-relaxed">
                    {product.description || "Un produit de qualité premium pour votre style unique."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
