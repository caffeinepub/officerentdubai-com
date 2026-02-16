import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

interface ContactAgentButtonProps {
  propertyTitle: string;
}

export default function ContactAgentButton({ propertyTitle }: ContactAgentButtonProps) {
  const phoneNumber = '971553723617';
  const message = encodeURIComponent(`Hi, I'm interested in the property: ${propertyTitle}`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Button 
      asChild 
      size="lg" 
      className="w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <SiWhatsapp className="h-5 w-5" />
        Contact Agent on WhatsApp
      </a>
    </Button>
  );
}
