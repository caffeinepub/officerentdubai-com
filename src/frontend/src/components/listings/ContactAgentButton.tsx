import { Button } from '@/components/ui/button';
import { SiWhatsapp } from 'react-icons/si';

interface ContactAgentButtonProps {
  propertyTitle: string;
  listingUrl?: string;
}

export default function ContactAgentButton({ propertyTitle, listingUrl }: ContactAgentButtonProps) {
  const phoneNumber = '971553723617';
  
  // Construct the message with property title and URL
  let messageText = `Hi, I'm interested in the property: ${propertyTitle}`;
  
  // Add the listing URL if provided, otherwise use current page URL
  const urlToInclude = listingUrl || window.location.href;
  messageText += `\n\nProperty Link: ${urlToInclude}`;
  
  const message = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Button 
      asChild 
      size="lg" 
      className="w-full gap-2"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <SiWhatsapp className="h-5 w-5" />
        Contact Agent on WhatsApp
      </a>
    </Button>
  );
}

